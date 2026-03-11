import { ProxyService } from '#services/proxy_service';
import { actionProxyValidator } from '#validators/proxy';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class StartProxyController {
	constructor(private readonly proxyService: ProxyService) {}

	async execute({ request, response, auth }: HttpContext) {
		const { params } = await request.validateUsing(actionProxyValidator);
		const user = auth.getUserOrFail();
		await this.proxyService.startUserProxy(params.configId, user.id);
		return response.redirect().back();
	}
}
