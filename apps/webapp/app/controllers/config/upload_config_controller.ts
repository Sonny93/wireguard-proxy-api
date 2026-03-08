import { ConfigService } from '#services/config_service';
import { uploadConfigValidator } from '#validators/upload_config';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';

@inject()
export default class UploadConfigController {
	constructor(private readonly configService: ConfigService) {}

	async execute({ request, response }: HttpContext) {
		const { configs } = await request.validateUsing(uploadConfigValidator);
		await Promise.all(
			configs.map(async (config) => {
				const key = this.configService.sanitizeConfigFilename(
					config.clientName
				);
				await config.moveToDisk(key);
			})
		);
		logger.info(`${configs.length} configs uploaded successfully`);
		return response.redirect().back();
	}
}
