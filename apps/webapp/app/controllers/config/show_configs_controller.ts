import { ConfigService } from '#services/config_service';
import { ProxyWorkerService } from '@wireguard-proxy/core';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class ShowConfigsController {
	constructor(
		private readonly proxyWorkerService: ProxyWorkerService,
		private readonly configService: ConfigService
	) {}

	async render({ inertia }: HttpContext) {
		const configs = await this.configService.getConfigFiles();
		const activeProxies = await this.proxyWorkerService.listActive();
		return inertia.render('home', { configs, activeProxies });
	}
}
