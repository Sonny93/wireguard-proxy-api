import { ProxyService } from '#services/proxy_service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class RestartAllProxiesController {
	constructor(private readonly proxyService: ProxyService) {}

	async execute({ response, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		await this.proxyService.restartAllProxies(user.id);
		return response.redirect().back();
	}
}
