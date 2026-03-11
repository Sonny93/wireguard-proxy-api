import { ProxyService } from '#services/proxy_service';
import { actionProxyValidator } from '#validators/proxy';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class StopProxyController {
	constructor(private readonly proxyService: ProxyService) {}

	async execute({ request, response, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		const { params } = await request.validateUsing(actionProxyValidator);
		await this.proxyService.stopProxy(params.configId, user.id);
		return response.redirect().back();
	}
}
