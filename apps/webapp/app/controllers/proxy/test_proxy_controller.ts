import { ProxyWorkerService } from '@wireguard-proxy/core';
import { actionProxyValidator } from '#validators/proxy';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class TestProxyController {
	constructor(private readonly proxyWorkerService: ProxyWorkerService) {}

	async execute({ request, response }: HttpContext) {
		const payload = await request.validateUsing(actionProxyValidator);
		const result = await this.proxyWorkerService.testProxy(payload.configName);
		return response.json(result);
	}
}
