import { ConfigService } from '#services/config_service';
import { ProxyWorkerService } from '#services/proxy_worker_service';
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
		const names = configs.map((config) => config.name);
		await Promise.all(
			names.map((name) =>
				this.proxyWorkerService.stopByConfig(name)
			)
		);
		await Promise.all(
			names.map((name) => this.proxyWorkerService.start(name))
		);
		return response.redirect().back();
	}
}

