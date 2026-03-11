import { ConfigService } from '#services/config_service';
import ConfigTransformer from '#transformers/config_transformer';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { ProxyWorkerService } from '@wireguard-proxy/core';

@inject()
export default class ShowConfigsController {
	constructor(
		private readonly proxyWorkerService: ProxyWorkerService,
		private readonly configService: ConfigService
	) {}

	async render({ inertia, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		const configs = await this.configService.getUserConfigs(user.id);
		const activeProxies = await this.proxyWorkerService.listActive();
		return inertia.render('home', {
			configs: ConfigTransformer.transform(configs),
			activeProxies,
		});
	}
}
