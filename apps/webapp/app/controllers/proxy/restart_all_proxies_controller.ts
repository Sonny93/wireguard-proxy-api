import { ConfigService } from '#services/config_service';
import { ProxyWorkerService } from '@wireguard-proxy/core';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class RestartAllProxiesController {
	constructor(
		private readonly proxyWorkerService: ProxyWorkerService,
		private readonly configService: ConfigService
	) {}

	async execute({ response }: HttpContext) {
		const configs = await this.configService.getConfigFiles();
		for (const config of configs) {
			await this.proxyWorkerService.stopByConfig(config.name);
			await this.proxyWorkerService.start(config.name);
		}
		return response.redirect().back();
	}
}
