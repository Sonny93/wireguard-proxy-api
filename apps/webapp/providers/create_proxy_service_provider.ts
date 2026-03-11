import { ConfigService } from '#services/config_service';
import { ProxyService } from '#services/proxy_service';
import type { ApplicationService } from '@adonisjs/core/types';
import { ProxyWorkerService } from '@wireguard-proxy/core';

export default class CreateProxyServiceProvider {
	constructor(protected app: ApplicationService) {}

	async boot() {
		this.app.container.singleton('proxyservice', async () => {
			const proxyWorkerService =
				await this.app.container.make(ProxyWorkerService);
			const configService = await this.app.container.make(ConfigService);
			return new ProxyService(proxyWorkerService, configService);
		});
	}
}
