import { ConfigService } from '#services/config_service';
import { ProxyWorkerService } from '#services/proxy_worker_service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class StartAllProxiesController {
	constructor(
		private readonly proxyWorkerService: ProxyWorkerService,
		private readonly configService: ConfigService
	) {}

	async execute({ response }: HttpContext) {
		const configs = await this.configService.getConfigFiles();
		for (const config of configs) {
			await this.proxyWorkerService.start(config.name);
		}
		return response.redirect().back();
	}
}
