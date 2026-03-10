import { ProxyWorkerService } from '@wireguard-proxy/core';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class PickProxyController {
	constructor(private readonly proxyWorkerService: ProxyWorkerService) {}

	async handle({ response }: HttpContext) {
		const list = await this.proxyWorkerService.listActive();
		if (list.length === 0) {
			return response.json({ proxy: null });
		}
		const proxy = list[Math.floor(Math.random() * list.length)];
		return response.json({ proxy });
	}
}
