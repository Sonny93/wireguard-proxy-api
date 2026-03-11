import { ConfigService } from '#services/config_service';
import { uploadConfigValidator } from '#validators/config';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';

@inject()
export default class CreateConfigController {
	constructor(private readonly configService: ConfigService) {}

	async execute({ request, response, auth }: HttpContext) {
		const { configs } = await request.validateUsing(uploadConfigValidator);
		const user = auth.getUserOrFail();
		await this.configService.createMany(user.id, configs);
		logger.info(`${configs.length} configs created successfully`);
		return response.redirect().back();
	}
}
