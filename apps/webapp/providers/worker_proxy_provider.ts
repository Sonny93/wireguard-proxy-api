import env from '#start/env';
import app from '@adonisjs/core/services/app';
import { HttpProxyClient, ProxyWorkerService } from '@wireguard-proxy/core';

export default class WorkerProxyProvider {
	private resolveDockerSocketPath(): string | undefined {
		return env.get('DOCKER_SOCKET_PATH');
	}

	private resolveImageName(): string {
		return env.get('GLUETUN_IMAGE_NAME', 'qmcgaw/gluetun:latest');
	}

	private resolveProxyTestHost(): string {
		return env.get('PROXY_TEST_HOST', '127.0.0.1');
	}

	private resolveBaseHostPort(): number | undefined {
		const raw = env.get('PROXY_BASE_HOST_PORT');
		if (!raw) return undefined;
		const port = Number.parseInt(raw, 10);
		if (!Number.isFinite(port) || port <= 0 || port > 65535) {
			throw new Error('Invalid PROXY_BASE_HOST_PORT');
		}
		return port;
	}

	private resolveNetworkName(): string | undefined {
		return env.get('PROXY_NETWORK_NAME');
	}

	private resolveGluetunEnv(): Record<string, string> {
		return {
			VPN_SERVICE_PROVIDER: env.get('VPN_SERVICE_PROVIDER', 'custom'),
			VPN_TYPE: env.get('VPN_TYPE', 'wireguard'),
			TZ: env.get('TZ', 'Europe/Paris'),
		};
	}

	async boot() {
		const logger = await app.container.make('logger');

		const httpProxyClient = new HttpProxyClient();
		const proxyService = new ProxyWorkerService(
			{
				imageName: this.resolveImageName(),
				dockerSocketPath: this.resolveDockerSocketPath(),
				proxyTestHost: this.resolveProxyTestHost(),
				baseHostPort: this.resolveBaseHostPort(),
				networkName: this.resolveNetworkName(),
				gluetunEnv: this.resolveGluetunEnv(),
				logger,
			},
			httpProxyClient
		);

		app.container.singleton(HttpProxyClient, () => httpProxyClient);
		app.container.singleton(ProxyWorkerService, () => proxyService);

		await proxyService.ensureNetworkExists();

		logger.info('Proxy workers use gluetun image', {
			imageName: this.resolveImageName(),
		});
	}

	async ready() {
		const proxyWorkerService = await app.container.make(ProxyWorkerService);
		await proxyWorkerService.removeAll();
	}

	async shutdown() {
		const proxyWorkerService = await app.container.make(ProxyWorkerService);
		await proxyWorkerService.removeAll();
	}
}
