import WireguardConfig from '#models/wireguard_config';
import { ConfigService } from '#services/config_service';
import { actionProxyValidator } from '#validators/proxy';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { ProxyWorkerService } from '@wireguard-proxy/core';

@inject()
export default class RestartProxyController {
	constructor(
		private readonly proxyWorkerService: ProxyWorkerService,
		private readonly configService: ConfigService
	) {}

	async execute({ request, response, auth }: HttpContext) {
		const payload = await request.validateUsing(actionProxyValidator);
		const user = auth.getUserOrFail();
		const config = await WireguardConfig.query()
			.where({ userId: user.id, name: payload.configName })
			.firstOrFail();
		const privateKey = this.configService.getDecryptedPrivateKey(config);
		if (!privateKey) {
			return response.badRequest({ ok: false, error: 'Invalid private key' });
		}
		await this.proxyWorkerService.restart(payload.configName, privateKey);
		return response.redirect().back();
	}
}
