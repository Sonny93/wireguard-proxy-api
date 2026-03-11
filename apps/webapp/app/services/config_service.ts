import WireguardConfig from '#models/wireguard_config';
import { inject } from '@adonisjs/core';
import app from '@adonisjs/core/services/app';
import encryption from '@adonisjs/core/services/encryption';
import path from 'node:path';

type Config = {
	name: string;
	privateKey: string;
};

@inject()
export class ConfigService {
	async createMany(
		userId: number,
		configs: Config[]
	): Promise<WireguardConfig[]> {
		const normalizedConfigs = configs.map((config) => ({
			name: this.#normalizeConfigName(config.name),
			privateKey: encryption.encrypt(config.privateKey),
			userId,
		}));

		return WireguardConfig.updateOrCreateMany('name', normalizedConfigs);
	}

	getDecryptedPrivateKey(config: WireguardConfig): string | null {
		return encryption.decrypt(config.privateKey);
	}

	async deleteByIdAndUser(id: number, userId: number): Promise<void> {
		const proxyService = await app.container.make('proxyservice');
		const config = await WireguardConfig.query()
			.where({ id, userId })
			.firstOrFail();
		await proxyService.stopUserProxy(config.id, userId);
		await config.delete();
	}

	getUserConfigs(userId: number) {
		return WireguardConfig.query().where({ userId }).orderBy('name', 'asc');
	}

	getUserConfigById(configId: number, userId: number) {
		return WireguardConfig.query()
			.where({ id: configId, userId })
			.orderBy('name', 'asc')
			.firstOrFail();
	}

	#normalizeConfigName(name: string): string {
		const base = path.basename(name, '.conf') || name.trim() || 'config';
		return base.replaceAll(/[^\w.-]/g, '_').slice(0, 255);
	}
}
