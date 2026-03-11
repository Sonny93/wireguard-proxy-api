import WireguardConfig from '#models/wireguard_config';
import { ConfigService } from '#services/config_service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { ProxyWorkerService } from '@wireguard-proxy/core';

@inject()
export default class RestartAllProxiesController {
	constructor(
		private readonly proxyWorkerService: ProxyWorkerService,
		private readonly configService: ConfigService
	) {}

	async execute({ response, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		const configs = await WireguardConfig.query()
			.where({ userId: user.id })
			.orderBy('name', 'asc');

		for (const config of configs) {
			await this.proxyWorkerService.stopByConfig(config.name);
		}

		for (const config of configs) {
			const privateKey = this.configService.getDecryptedPrivateKey(config);
			if (!privateKey) continue;
			await this.proxyWorkerService.start(config.name, privateKey);
		}

		return response.redirect().back();
	}
}
