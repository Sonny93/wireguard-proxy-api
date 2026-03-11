import { actionProxyValidator } from '#validators/proxy';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { ProxyWorkerService } from '@wireguard-proxy/core';

@inject()
export default class StopProxyController {
	constructor(private readonly proxyWorkerService: ProxyWorkerService) {}

	async execute({ request, response }: HttpContext) {
		const payload = await request.validateUsing(actionProxyValidator);
		await this.proxyWorkerService.stopByConfig(payload.configName);
		return response.redirect().back();
	}
}
