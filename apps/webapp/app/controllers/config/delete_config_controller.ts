import { ConfigService } from '#services/config_service';
import { deleteConfigValidator } from '#validators/config';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class DeleteConfigController {
	constructor(private readonly configService: ConfigService) {}

	async execute({ request, response, auth }: HttpContext) {
		const { params } = await request.validateUsing(deleteConfigValidator);
		const user = auth.getUserOrFail();
		await this.configService.deleteByIdAndUser(params.id, user.id);
		return response.redirect().back();
	}
}
