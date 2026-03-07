import app from '@adonisjs/core/services/app';
import env from '#start/env';
import path from 'node:path';

function getConfigsDir(): string {
	const custom = env.get('STORAGE_CONFIGS_PATH');
	if (custom) return path.resolve(custom);
	return app.makePath('storage/configs');
}

export const storageConfigsPath = getConfigsDir();
