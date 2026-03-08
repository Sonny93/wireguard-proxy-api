import { ProxyWorkerService } from '#services/proxy_worker_service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class GetProxiesController {
	constructor(private readonly proxyWorkerService: ProxyWorkerService) {}

	async render({ response }: HttpContext) {
		const list = await this.proxyWorkerService.listActive();
		return response.json({ proxies: list });
	}
}
