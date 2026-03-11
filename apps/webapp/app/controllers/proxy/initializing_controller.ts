import { HttpContext } from '@adonisjs/core/http';

export default class InitializingController {
	async render({ inertia }: HttpContext) {
		return inertia.render('proxy/initializing', {});
	}
}

