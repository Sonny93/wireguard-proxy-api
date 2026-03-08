import app from '@adonisjs/core/services/app';
import { HttpProxyClient, ProxyWorkerService } from '@wireguard-proxy/core';
import path from 'node:path';

export default class WireGuardProxyProvider {
	private resolveConfigsPath(): string {
		const custom = process.env.STORAGE_CONFIGS_PATH;
		if (custom) return path.resolve(custom);
		return app.makePath('storage/configs');
	}

	private resolveBuildContextPath(): string {
		const custom = process.env.PROXY_BUILD_CONTEXT_PATH;
		if (custom) return path.resolve(custom);
		return path.resolve(app.makePath('..'), 'proxy');
	}

	private resolveImageName(): string {
		return process.env.PROXY_IMAGE_NAME ?? 'wireguard-proxy';
	}

	private resolveDockerSocketPath(): string | undefined {
		return process.env.DOCKER_SOCKET_PATH;
	}

	private resolveProxyTestHost(): string {
		return process.env.PROXY_TEST_HOST ?? '127.0.0.1';
	}

	async boot() {
		const logger = await app.container.make('logger');

		const httpProxyClient = new HttpProxyClient();
		const proxyService = new ProxyWorkerService(
			{
				imageName: this.resolveImageName(),
				configsPath: this.resolveConfigsPath(),
				buildContextPath: this.resolveBuildContextPath(),
				dockerSocketPath: this.resolveDockerSocketPath(),
				proxyTestHost: this.resolveProxyTestHost(),
				logger,
			},
			httpProxyClient
		);

		app.container.singleton(HttpProxyClient, () => httpProxyClient);
		app.container.singleton(ProxyWorkerService, () => proxyService);

		logger.info('Waiting for proxy image to be ready', {
			imageName: this.resolveImageName(),
			buildContextPath: this.resolveBuildContextPath(),
		});
		await proxyService.ensureImageReady();
		logger.info('Proxy image is ready', {
			imageName: this.resolveImageName(),
			buildContextPath: this.resolveBuildContextPath(),
		});
	}
}
