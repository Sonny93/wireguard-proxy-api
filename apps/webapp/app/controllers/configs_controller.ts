import { storageConfigsPath } from '#config/storage';
import { ProxyWorkerService } from '#services/proxy_worker_service';
import { uploadConfigValidator } from '#validators/upload_config';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import drive from '@adonisjs/drive/services/main';
import fs from 'node:fs/promises';
import path from 'node:path';

function sanitizeConfigFilename(clientName: string): string {
	const base = path.basename(clientName, '.conf') || 'config';
	return `${base}.conf`;
}

@inject()
export default class ConfigsController {
	constructor(private readonly proxyWorkerService: ProxyWorkerService) {}

	async index({ inertia }: HttpContext) {
		await fs.mkdir(storageConfigsPath, { recursive: true });
		const disk = drive.use();
		const { objects } = await disk.listAll('');
		const configs = [...objects]
			.filter(
				(o): o is typeof o & { isFile: true; key: string } =>
					o.isFile && 'key' in o && o.key.endsWith('.conf')
			)
			.map((o) => ({ name: o.key }));
		const activeProxies = await this.proxyWorkerService.listActive();
		return inertia.render('home', { configs, activeProxies });
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
			count === 1
				? 'Config uploaded successfully'
				: `${count} configs uploaded successfully`
		);
		return response.redirect().back();
	}
}
