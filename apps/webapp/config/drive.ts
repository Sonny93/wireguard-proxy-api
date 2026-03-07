import { storageConfigsPath } from '#config/storage';
import env from '#start/env';
import { defineConfig, services } from '@adonisjs/drive';
import type { InferDriveDisks } from '@adonisjs/drive/types';

const driveConfig = defineConfig({
	default: env.get('DRIVE_DISK'),
	services: {
		fs: services.fs({
			location: storageConfigsPath,
			serveFiles: false,
			visibility: 'private',
		}),
	},
});

export default driveConfig;

declare module '@adonisjs/drive/types' {
	export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
