import WireguardConfig from '#models/wireguard_config';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { ProxyWorkerService } from '@wireguard-proxy/core';

@inject()
export default class StopAllProxiesController {
	constructor(private readonly proxyWorkerService: ProxyWorkerService) {}

	async execute({ response, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		const configs = await WireguardConfig.query()
			.where({ userId: user.id })
			.orderBy('name', 'asc');

		for (const config of configs) {
			await this.proxyWorkerService.stopByConfig(config.name);
		}

		return response.redirect().back();
	}
}
