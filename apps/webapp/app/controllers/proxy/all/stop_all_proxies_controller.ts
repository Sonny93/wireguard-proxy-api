import { ProxyService } from '#services/proxy_service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class StopAllProxiesController {
	constructor(private readonly proxyService: ProxyService) {}

	async execute({ response, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		await this.proxyService.stopUserProxies(user.id);
		return response.redirect().back();
	}
}
