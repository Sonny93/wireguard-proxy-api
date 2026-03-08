import drive from '@adonisjs/drive/services/main';
import path from 'node:path';

export class ConfigService {
	async getConfigFiles() {
		const disk = drive.use();
		const { objects } = await disk.listAll('');
		return [...objects].filter((o) => o.isFile && o.key.endsWith('.conf'));
	}

	sanitizeConfigFilename(clientName: string): string {
		const base = path.basename(clientName, '.conf') || 'config';
		return `${base}.conf`;
	}
}
