import User from '#models/user';
import { loginValidator } from '#validators/login';
import type { HttpContext } from '@adonisjs/core/http';

export default class SessionsController {
	async create({ inertia }: HttpContext) {
		return inertia.render('auth/login', {});
	}

	async store({ request, response, auth, session }: HttpContext) {
		const { email, password } = await request.validateUsing(loginValidator);
		const user = await User.verifyCredentials(email, password);
		await auth.use('web').login(user);
		session.flash('success', 'Signed in successfully');
		return response.redirect().toRoute('home');
	}

	async destroy({ response, auth, session }: HttpContext) {
		await auth.use('web').logout();
		session.flash('success', 'Signed out successfully');
		return response.redirect().toRoute('login');
	}
}
