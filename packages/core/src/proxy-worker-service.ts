import Docker from "dockerode";
import { HttpProxyClient } from "./http-proxy-client.js";
import type { Logger } from "./logger.js";
import { noopLogger } from "./logger.js";

const GLUETUN_HTTP_PROXY_PORT = 8888;
const CONTAINER_NAME_PREFIX = "proxy-";
const TEST_PROXY_URL = "https://httpbin.org/ip";
const TEST_PROXY_TIMEOUT_MS = 15_000;

export type ProxyWorkerOptions = {
	imageName: string;
	dockerSocketPath?: string;
	proxyTestHost?: string;
	baseHostPort?: number;
	gluetunEnv: Record<string, string>;
	logger?: Logger;
};

export type ActiveProxy = {
	id: string;
	name: string;
	configName: string;
	port: number;
};

export type TestProxyResult =
	| { ok: true; ip: string }
	| { ok: false; error: string };

function containerNameFromConfig(configName: string): string {
	const safe = (configName || "default").replaceAll(/[^a-zA-Z0-9_-]/g, "-");
	return `${CONTAINER_NAME_PREFIX}${safe}`;
}

function extractJsonStringField(body: string, field: string): string | null {
	const start = body.indexOf("{");
	const end = body.lastIndexOf("}");
	if (start === -1 || end < start) return null;
	try {
		const json = JSON.parse(body.slice(start, end + 1)) as Record<
			string,
			unknown
		>;
		const value = json[field];
		return typeof value === "string" ? value : null;
	} catch {
		return null;
	}
}

type DockerMount = { Source: string; Destination: string };

export class ProxyWorkerService {
	readonly #docker: Docker;
	readonly #options: ProxyWorkerOptions;
	readonly #httpProxyClient: HttpProxyClient;
	readonly #logger: Logger;
	#ensureImageReadyPromise: Promise<void> | null = null;

	constructor(
		options: ProxyWorkerOptions,
		httpProxyClient = new HttpProxyClient()
	) {
		this.#options = options;
		this.#httpProxyClient = httpProxyClient;
		this.#logger = options.logger ?? noopLogger;
		this.#docker = new Docker(
			options.dockerSocketPath ? { socketPath: options.dockerSocketPath } : {}
		);
	}

	async isImageReady(): Promise<boolean> {
		const image = this.#docker.getImage(this.#options.imageName);
		try {
			await image.inspect();
			return true;
		} catch {
			return false;
		}
	}

	async ensureImageReady(): Promise<void> {
		if (this.#ensureImageReadyPromise) return this.#ensureImageReadyPromise;
		this.#ensureImageReadyPromise = this.#doEnsureImageReady().finally(() => {
			this.#ensureImageReadyPromise = null;
		});
		return this.#ensureImageReadyPromise;
	}

	async #doEnsureImageReady(): Promise<void> {
		const ready = await this.isImageReady();
		if (ready) return;
		this.#logger.info("Image not found, pulling...", {
			imageName: this.#options.imageName,
		});
		await this.#pullImage(this.#options.imageName);
		this.#logger.info("Image pulled", { imageName: this.#options.imageName });
	}

	async #pullImage(imageName: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.#docker.pull(
				imageName,
				(err: unknown, stream: NodeJS.ReadableStream) => {
					if (err) {
						return reject(err instanceof Error ? err : new Error(String(err)));
					}
					if (!stream) return reject(new Error("No pull stream"));
					this.#docker.modem.followProgress(stream, (err: unknown) => {
						if (err)
							reject(err instanceof Error ? err : new Error(String(err)));
						else resolve();
					});
				}
			);
		});
	}

	async listActive(): Promise<ActiveProxy[]> {
		const containers = await this.#docker.listContainers({
			all: false,
			filters: { ancestor: [this.#options.imageName] },
		});
		return Promise.all(containers.map((c) => this.#containerToActiveProxy(c)));
	}

	async testProxy(configName: string): Promise<TestProxyResult> {
		const proxy = await this.#findProxyByConfig(configName);
		if (!proxy) return { ok: false, error: "Proxy not running" };

		const proxyHost = this.#options.proxyTestHost ?? "127.0.0.1";
		this.#logger.debug("Testing proxy", { proxyPort: proxy.port, configName });

		try {
			const body = await this.#httpProxyClient.get(
				proxyHost,
				proxy.port,
				TEST_PROXY_URL,
				TEST_PROXY_TIMEOUT_MS
			);
			const ip = extractJsonStringField(body, "origin");
			return ip ? { ok: true, ip } : { ok: false, error: "No IP in response" };
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			return { ok: false, error: message };
		}
	}

	async start(
		configName: string,
		wireguardPrivateKey: string
	): Promise<ActiveProxy> {
		await this.ensureImageReady();
		const name = containerNameFromConfig(configName);
		const existing = await this.#findContainersByName(name);
		if (existing.length > 0) {
			const running = await this.#reuseOrRemoveExisting(existing[0], name);
			if (running) return running;
		}
		return this.#createAndStartContainer(name, configName, wireguardPrivateKey);
	}

	async stop(containerIdOrName: string): Promise<void> {
		const container = this.#docker.getContainer(containerIdOrName);
		await container.stop();
		await container.remove();
	}

	async stopByConfig(configName: string): Promise<boolean> {
		const name = containerNameFromConfig(configName);
		const list = await this.#findContainersByName(name);
		if (list.length === 0) return false;
		await this.stop(list[0].Id);
		return true;
	}

	async restart(
		configName: string,
		wireguardPrivateKey: string
	): Promise<ActiveProxy> {
		await this.stopByConfig(configName);
		return this.start(configName, wireguardPrivateKey);
	}

	async #getConfigNameFromContainer(containerId: string): Promise<string> {
		const inspect = await this.#docker.getContainer(containerId).inspect();
		const env = inspect.Config?.Env ?? [];
		const entry = env.find((e) => e.startsWith("PROXY_CONFIG_NAME="));
		return entry ? entry.split("=", 2)[1] ?? "" : "";
	}

	async #containerToActiveProxy(c: Docker.ContainerInfo): Promise<ActiveProxy> {
		const name = c.Names?.[0]?.replace(/^\//, "") ?? c.Id;
		const port =
			c.Ports?.find((p) => p.PrivatePort === GLUETUN_HTTP_PROXY_PORT)
				?.PublicPort ?? GLUETUN_HTTP_PROXY_PORT;
		const configName = await this.#getConfigNameFromContainer(c.Id);
		return { id: c.Id, name, configName, port };
	}

	async #findProxyByConfig(configName: string): Promise<ActiveProxy | null> {
		const active = await this.listActive();
		return active.find((p) => p.configName === configName) ?? null;
	}

	async #findContainersByName(name: string): Promise<Docker.ContainerInfo[]> {
		return this.#docker.listContainers({
			all: true,
			filters: { name: [name] },
		});
	}

	async #reuseOrRemoveExisting(
		existing: Docker.ContainerInfo,
		name: string
	): Promise<ActiveProxy | null> {
		if (existing.State === "running") {
			const configName = await this.#getConfigNameFromContainer(existing.Id);
			const port =
				existing.Ports?.find((p) => p.PrivatePort === GLUETUN_HTTP_PROXY_PORT)
					?.PublicPort ?? GLUETUN_HTTP_PROXY_PORT;
			return { id: existing.Id, name, configName, port };
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
		const base = this.#options.baseHostPort ?? 3128;
		let port = base;
		while (used.has(port)) port++;
		return port;
	}

	async #createAndStartContainer(
		name: string,
		configName: string,
		wireguardPrivateKey: string
	): Promise<ActiveProxy> {
		const usedPorts = await this.#usedHostPorts();
		const hostPort = this.#nextAvailablePort(usedPorts);

		const env = {
			...this.#options.gluetunEnv,
			HTTPPROXY: "on",
			HTTPPROXY_LISTENING_ADDRESS: `:${GLUETUN_HTTP_PROXY_PORT}`,
			WIREGUARD_PRIVATE_KEY: wireguardPrivateKey,
			PROXY_CONFIG_NAME: configName,
		};

		const container = await this.#docker.createContainer({
			Image: this.#options.imageName,
			name,
			HostConfig: {
				CapAdd: ["NET_ADMIN"],
				Devices: [
					{
						PathOnHost: "/dev/net/tun",
						PathInContainer: "/dev/net/tun",
						CgroupPermissions: "rwm",
					},
				],
				PortBindings: {
					[`${GLUETUN_HTTP_PROXY_PORT}/tcp`]: [{ HostPort: String(hostPort) }],
				},
			},
			Env: Object.entries(env)
				.filter(([, v]) => v !== undefined && v !== "")
				.map(([k, v]) => `${k}=${v}`),
		});
		await container.start();

		return {
			id: container.id,
			name,
			configName,
			port: hostPort,
		};
	}
}
