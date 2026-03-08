import { ProxyWorkerService } from '#services/proxy_worker_service';
import { actionProxyValidator } from '#validators/proxy';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class RestartProxyController {
	constructor(private readonly proxyWorkerService: ProxyWorkerService) {}

	async execute({ request, response }: HttpContext) {
		const payload = await request.validateUsing(actionProxyValidator);
		await this.proxyWorkerService.stopByConfig(payload.configName);
		await this.proxyWorkerService.start(payload.configName);
		return response.redirect().back();
	}
}
