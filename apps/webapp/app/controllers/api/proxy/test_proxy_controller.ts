import { ProxyWorkerService } from '@wireguard-proxy/core';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class TestProxyController {
	constructor(private readonly proxyWorkerService: ProxyWorkerService) {}

	async handle({ params, response }: HttpContext) {
		const configName = params.configName;
		if (!configName) {
			return response.badRequest({ ok: false, error: 'Missing configName' });
		}
		const result = await this.proxyWorkerService.testProxy(configName);
		return response.json(result);
	}
}
