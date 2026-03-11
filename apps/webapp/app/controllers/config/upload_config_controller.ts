import { ConfigService } from '#services/config_service';
import { uploadConfigValidator } from '#validators/config';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';

@inject()
export default class UploadConfigController {
	constructor(private readonly configService: ConfigService) {}

	async execute({ request, response, auth }: HttpContext) {
		const { configs } = await request.validateUsing(uploadConfigValidator);
		const user = auth.getUserOrFail();
		for (const { name, privateKey } of configs) {
			await this.configService.createOrUpdate(user.id, name, privateKey);
		}
		logger.info(`${configs.length} configs saved successfully`);
		return response.redirect().back();
	}
}
