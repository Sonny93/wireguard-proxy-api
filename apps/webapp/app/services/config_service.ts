import WireguardConfig from '#models/wireguard_config';
import encryption from '@adonisjs/core/services/encryption';
import path from 'node:path';

export class ConfigService {
	normalizeConfigName(name: string): string {
		const base = path.basename(name, '.conf') || name.trim() || 'config';
		return base.replaceAll(/[^\w.-]/g, '_').slice(0, 255);
	}

	async getConfigsForUser(userId: number) {
		return WireguardConfig.query()
			.where('user_id', userId)
			.orderBy('name', 'asc');
	}

	async createOrUpdate(
		userId: number,
		name: string,
		privateKey: string
	): Promise<WireguardConfig> {
		const normalizedName = this.normalizeConfigName(name);
		const encryptedPrivateKey = encryption.encrypt(privateKey);
		const existing = await WireguardConfig.query()
			.where({ userId, name: normalizedName })
			.first();
		if (existing) {
			existing.privateKey = encryptedPrivateKey;
			await existing.save();
			return existing;
		}
		return WireguardConfig.create({
			userId,
			name: normalizedName,
			privateKey: encryptedPrivateKey,
		});
	}

	getDecryptedPrivateKey(config: WireguardConfig): string | null {
		return encryption.decrypt(config.privateKey);
	}

	async deleteByIdAndUser(id: number, userId: number): Promise<void> {
		const config = await WireguardConfig.query()
			.where({ id, userId })
			.firstOrFail();
		await config.delete();
	}
}
