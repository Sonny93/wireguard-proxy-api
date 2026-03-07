import { storageConfigsPath } from '#config/storage';
import drive from '@adonisjs/drive/services/main';
import { uploadConfigValidator } from '#validators/upload_config';
import type { HttpContext } from '@adonisjs/core/http';
import path from 'node:path';
import fs from 'node:fs/promises';

function sanitizeConfigFilename(clientName: string): string {
	const base = path.basename(clientName, '.conf') || 'config';
	return `${base}.conf`;
}

export default class ConfigsController {
	async index({ inertia }: HttpContext) {
		await fs.mkdir(storageConfigsPath, { recursive: true });
		const disk = drive.use();
		const { objects } = await disk.listAll('');
		const configs = [...objects]
			.filter((o): o is typeof o & { isFile: true; key: string } => o.isFile && 'key' in o && o.key.endsWith('.conf'))
			.map((o) => ({ name: o.key }));
		return inertia.render('home', { configs });
	}

	async store({ request, response, session }: HttpContext) {
		const { configs } = await request.validateUsing(uploadConfigValidator);
		for (const config of configs) {
			const key = sanitizeConfigFilename(config.clientName);
			await config.moveToDisk(key);
		}
		const count = configs.length;
		session.flash(
			'success',
			count === 1 ? 'Config uploaded successfully' : `${count} configs uploaded successfully`
		);
		return response.redirect().back();
	}
}
