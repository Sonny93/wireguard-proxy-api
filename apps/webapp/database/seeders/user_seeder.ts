import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class UserSeeder extends BaseSeeder {
	async run() {
		await User.create({
			email: 'admin@example.com',
			password: '^bW4zyz3Tidjqe',
		});
	}
}
