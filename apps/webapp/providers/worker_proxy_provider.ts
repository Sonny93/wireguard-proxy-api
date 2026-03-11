import app from '@adonisjs/core/services/app';
import { HttpProxyClient, ProxyWorkerService } from '@wireguard-proxy/core';

export default class WorkerProxyProvider {
	private resolveDockerSocketPath(): string | undefined {
		return process.env.DOCKER_SOCKET_PATH;
	}

	private resolveImageName(): string {
		return (process.env.GLUETUN_IMAGE_NAME ?? 'qmcgaw/gluetun:latest').trim();
	}

	private resolveProxyTestHost(): string {
		return process.env.PROXY_TEST_HOST ?? '127.0.0.1';
	}

	private resolveBaseHostPort(): number | undefined {
		const raw = process.env.PROXY_BASE_HOST_PORT?.trim();
		if (!raw) return undefined;
		const port = Number.parseInt(raw, 10);
		if (!Number.isFinite(port) || port <= 0 || port > 65535) {
			throw new Error('Invalid PROXY_BASE_HOST_PORT');
		}
		return port;
	}

	private resolveGluetunEnv(): Record<string, string> {
		return {
			VPN_SERVICE_PROVIDER: process.env.VPN_SERVICE_PROVIDER ?? 'custom',
			VPN_TYPE: process.env.VPN_TYPE ?? 'wireguard',
			TZ: process.env.TZ ?? 'Europe/Paris',
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
				gluetunEnv: this.resolveGluetunEnv(),
				logger,
			},
			httpProxyClient
		);

		app.container.singleton(HttpProxyClient, () => httpProxyClient);
		app.container.singleton(ProxyWorkerService, () => proxyService);

		logger.info('Proxy workers use gluetun image', {
			imageName: this.resolveImageName(),
		});
	}

	async ready() {
		const proxyWorkerService = await app.container.make(ProxyWorkerService);
		await proxyWorkerService.stopAll();
	}

	async shutdown() {
		const proxyWorkerService = await app.container.make(ProxyWorkerService);
		await proxyWorkerService.stopAll();
	}
}
