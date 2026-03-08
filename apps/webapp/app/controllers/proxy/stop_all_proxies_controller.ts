import { ProxyWorkerService } from '@wireguard-proxy/core';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class StopAllProxiesController {
	constructor(private readonly proxyWorkerService: ProxyWorkerService) {}

	async execute({ response }: HttpContext) {
		const active = await this.proxyWorkerService.listActive();
		await Promise.all(
			active.map((proxy) => this.proxyWorkerService.stop(proxy.id))
		);
		return response.redirect().back();
	}
}
