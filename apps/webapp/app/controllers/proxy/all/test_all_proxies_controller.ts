import { ProxyService } from '#services/proxy_service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class TestAllProxiesController {
	constructor(private readonly proxyService: ProxyService) {}

	async execute({ response, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		await this.proxyService.testUserProxies(user.id);
		return response.redirect().back();
	}
}
