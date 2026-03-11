import { ProxyService } from '#services/proxy_service';
import { HttpContext } from '@adonisjs/core/http';

export default class TestAllProxiesController {
	constructor(private readonly proxyService: ProxyService) {}

	async execute({ response, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		await this.proxyService.testAllProxies(user.id);
		return response.redirect().back();
	}
}
