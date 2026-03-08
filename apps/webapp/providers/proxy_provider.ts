import { storageConfigsPath } from '#config/storage';
import { HttpProxyClient } from '#services/http_proxy_client';
import { ProxyWorkerService } from '#services/proxy_worker_service';
import env from '#start/env';
import app from '@adonisjs/core/services/app';
import path from 'node:path';

function getProxyBuildContextPath(): string {
	const custom = env.get('PROXY_BUILD_CONTEXT_PATH');
	if (custom) return path.resolve(custom);
	return path.resolve(app.makePath('..'), 'proxy');
}

export default class ProxyProvider {
	async boot() {
		app.container.singleton(HttpProxyClient, () => new HttpProxyClient());
		app.container.singleton(ProxyWorkerService, async (resolver) => {
			const logger = await resolver.make('logger');
			const httpProxyClient = await resolver.make(HttpProxyClient);
			const imageName = env.get('PROXY_IMAGE_NAME', 'wireguard-proxy');
			const buildContextPath = getProxyBuildContextPath();
			const proxyService = new ProxyWorkerService(
				{
					imageName,
					configsPath: storageConfigsPath,
					buildContextPath,
					dockerSocketPath: env.get('DOCKER_SOCKET_PATH'),
					proxyTestHost: env.get('PROXY_TEST_HOST') ?? '127.0.0.1',
				},
				httpProxyClient
			);
			logger.info('Waiting for proxy image to be ready', {
				imageName,
				buildContextPath,
			});
			await proxyService.ensureImageReady();
			logger.info('Proxy image is ready', { imageName, buildContextPath });
			return proxyService;
		});
	}
}
