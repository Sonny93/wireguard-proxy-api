import logger from '@adonisjs/core/services/logger';
import Docker from 'dockerode';
import fs from 'node:fs/promises';
import path from 'node:path';
import { HttpProxyClient } from '#services/http_proxy_client';

const PROXY_PORT = 3128;
const CONTAINER_NAME_PREFIX = 'proxy-';
const BUILD_CONTEXT_IGNORE = new Set(['.git', 'node_modules']);
const TEST_PROXY_URL = 'http://httpbin.org/ip';
const TEST_PROXY_TIMEOUT_MS = 15_000;

export type ProxyWorkerOptions = {
	imageName: string;
	configsPath: string;
	buildContextPath: string;
	dockerSocketPath?: string;
	proxyTestHost?: string;
};

export type ActiveProxy = {
	id: string;
	name: string;
	configFile: string;
	port: number;
};

export type TestProxyResult =
	| { ok: true; ip: string }
	| { ok: false; error: string };

function containerNameFromConfig(configFileName: string): string {
	const base = path.basename(configFileName, '.conf') || 'default';
	const safe = base.replaceAll(/[^a-zA-Z0-9_-]/g, '-');
	return `${CONTAINER_NAME_PREFIX}${safe}`;
}

async function listContextFiles(contextPath: string): Promise<string[]> {
	const result: string[] = [];
	async function walk(relativeDir: string): Promise<void> {
		const fullDir = path.join(contextPath, relativeDir);
		const entries = await fs.readdir(fullDir, { withFileTypes: true });
		for (const e of entries) {
			const rel = relativeDir ? `${relativeDir}/${e.name}` : e.name;
			if (e.isDirectory()) {
				if (BUILD_CONTEXT_IGNORE.has(e.name)) continue;
				await walk(rel);
			} else {
				result.push(rel);
			}
		}
	}
	await walk('');
	return result;
}

function extractJsonStringField(
	body: string,
	field: string
): string | null {
	const start = body.indexOf('{');
	const end = body.lastIndexOf('}');
	if (start === -1 || end < start) return null;
	try {
		const json = JSON.parse(body.slice(start, end + 1)) as Record<
			string,
			unknown
		>;
		const value = json[field];
		return typeof value === 'string' ? value : null;
	} catch {
		return null;
	}
}

type DockerMount = { Source: string; Destination: string };

export class ProxyWorkerService {
	readonly #docker: Docker;
	readonly #options: ProxyWorkerOptions;
	readonly #httpProxyClient: HttpProxyClient;

	constructor(
		options: ProxyWorkerOptions,
		httpProxyClient: HttpProxyClient
	) {
		this.#options = options;
		this.#httpProxyClient = httpProxyClient;
		this.#docker = new Docker(
			options.dockerSocketPath ? { socketPath: options.dockerSocketPath } : {}
		);
	}

	async ensureImageReady(): Promise<void> {
		const image = this.#docker.getImage(this.#options.imageName);
		try {
			await image.inspect();
			logger.debug('Image is ready');
		} catch {
			logger.debug('Image is not ready, building...');
			await this.#buildImage();
		}
	}

	async listActive(): Promise<ActiveProxy[]> {
		const containers = await this.#docker.listContainers({
			all: false,
			filters: { ancestor: [this.#options.imageName] },
		});
		return Promise.all(
			containers.map((c) => this.#containerToActiveProxy(c))
		);
	}

	async testProxy(configName: string): Promise<TestProxyResult> {
		const proxy = await this.#findProxyByConfig(configName);
		if (!proxy) {
			return { ok: false, error: 'Proxy not running' };
		}
		const proxyHost = this.#options.proxyTestHost ?? '127.0.0.1';
		logger.debug({ proxyPort: proxy.port }, 'Testing proxy');
		try {
			const body = await this.#httpProxyClient.get(
				proxyHost,
				proxy.port,
				TEST_PROXY_URL,
				TEST_PROXY_TIMEOUT_MS
			);
			const ip = extractJsonStringField(body, 'origin');
			return ip ? { ok: true, ip } : { ok: false, error: 'No IP in response' };
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			return { ok: false, error: message };
		}
	}

	async start(configFileName: string): Promise<ActiveProxy> {
		const name = containerNameFromConfig(configFileName);
		const configPath = path.join(this.#options.configsPath, configFileName);
		await fs.access(configPath);
		const existing = await this.#findContainersByName(name);
		if (existing.length > 0) {
			const running = await this.#reuseOrRemoveExisting(
				existing[0],
				name
			);
			if (running) return running;
		}
		return this.#createAndStartContainer(name, configPath, configFileName);
	}

	async stop(containerIdOrName: string): Promise<void> {
		const container = this.#docker.getContainer(containerIdOrName);
		await container.stop();
		await container.remove();
	}

	async stopByConfig(configFileName: string): Promise<boolean> {
		const name = containerNameFromConfig(configFileName);
		const list = await this.#findContainersByName(name);
		if (list.length === 0) return false;
		await this.stop(list[0].Id);
		return true;
	}

	async #buildImage(): Promise<void> {
		const contextPath = this.#options.buildContextPath;
		const src = await listContextFiles(contextPath);
		if (src.length === 0) {
			throw new Error(`Empty build context: ${contextPath}`);
		}
		logger.debug('Building image', { count: src.length });
		return new Promise((resolve, reject) => {
			this.#docker.buildImage(
				{ context: contextPath, src },
				{ t: this.#options.imageName },
				(err, stream) => {
					if (err) {
						logger.error('Error building image', { err });
						reject(err);
						return;
					}
					if (!stream) {
						reject(new Error('No build stream'));
						return;
					}
					this.#docker.modem.followProgress(stream, (err) => {
						if (err) {
							logger.error('Error following progress', { err });
							reject(err);
						} else {
							logger.debug('Build complete');
							resolve();
						}
					});
				}
			);
		});
	}

	async #getConfigFileFromContainer(containerId: string): Promise<string> {
		const inspect = await this.#docker.getContainer(containerId).inspect();
		const mounts = (inspect.Mounts ?? []) as DockerMount[];
		const vpnMount = mounts.find((m) => m.Destination === '/vpn/wg0.conf');
		return vpnMount ? path.basename(vpnMount.Source) : '';
	}

	async #containerToActiveProxy(
		c: Docker.ContainerInfo
	): Promise<ActiveProxy> {
		const name = c.Names?.[0]?.replace(/^\//, '') ?? c.Id;
		const port =
			c.Ports?.find((p) => p.PrivatePort === PROXY_PORT)?.PublicPort ??
			PROXY_PORT;
		const configFile = await this.#getConfigFileFromContainer(c.Id);
		return { id: c.Id, name, configFile, port };
	}

	async #findProxyByConfig(configName: string): Promise<ActiveProxy | null> {
		const active = await this.listActive();
		return active.find((p) => p.configFile === configName) ?? null;
	}

	async #findContainersByName(
		name: string
	): Promise<Docker.ContainerInfo[]> {
		return this.#docker.listContainers({
			all: true,
			filters: { name: [name] },
		});
	}

	async #reuseOrRemoveExisting(
		existing: Docker.ContainerInfo,
		name: string
	): Promise<ActiveProxy | null> {
		if (existing.State === 'running') {
			const configFile = await this.#getConfigFileFromContainer(
				existing.Id
			);
			const port =
				existing.Ports?.find((p) => p.PrivatePort === PROXY_PORT)
					?.PublicPort ?? PROXY_PORT;
			return { id: existing.Id, name, configFile, port };
		}
		const c = this.#docker.getContainer(existing.Id);
		await c.remove({ force: true });
		return null;
	}

	async #usedHostPorts(): Promise<Set<number>> {
		const containers = await this.#docker.listContainers({
			all: false,
			filters: { ancestor: [this.#options.imageName] },
		});
		const ports = new Set<number>();
		for (const c of containers) {
			for (const p of c.Ports ?? []) {
				if (p.PublicPort) ports.add(p.PublicPort);
			}
		}
		return ports;
	}

	#nextAvailablePort(used: Set<number>): number {
		let port = PROXY_PORT;
		while (used.has(port)) port++;
		return port;
	}

	async #createAndStartContainer(
		name: string,
		configPath: string,
		configFileName: string
	): Promise<ActiveProxy> {
		const usedPorts = await this.#usedHostPorts();
		const hostPort = this.#nextAvailablePort(usedPorts);
		const container = await this.#docker.createContainer({
			Image: this.#options.imageName,
			name,
			HostConfig: {
				CapAdd: ['NET_ADMIN'],
				Devices: [
					{
						PathOnHost: '/dev/net/tun',
						PathInContainer: '/dev/net/tun',
						CgroupPermissions: 'rwm',
					},
				],
				Sysctls: {
					'net.ipv4.ip_forward': '1',
					'net.ipv6.conf.all.forwarding': '1',
					'net.ipv4.conf.all.src_valid_mark': '1',
				},
				Binds: [`${configPath}:/vpn/wg0.conf:ro`],
				PortBindings: {
					[`${PROXY_PORT}/tcp`]: [{ HostPort: String(hostPort) }],
				},
			},
			Env: [`PROXY_PORT=${PROXY_PORT}`],
		});
		await container.start();
		return {
			id: container.id,
			name,
			configFile: configFileName,
			port: hostPort,
		};
	}
}
