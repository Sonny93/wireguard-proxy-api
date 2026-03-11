import WireguardConfig from '#models/wireguard_config';
import { ConfigService } from '#services/config_service';
import { inject } from '@adonisjs/core';
import { ProxyWorkerService } from '@wireguard-proxy/core';

@inject()
export class ProxyService {
	constructor(
		private readonly proxyWorkerService: ProxyWorkerService,
		private readonly configService: ConfigService
	) {}

	async startProxy(configId: number, userId: number) {
		const config = await this.#getUserConfigById(configId, userId);

		const privateKey = this.#getDecryptedPrivateKey(config);
		if (!privateKey) {
			throw new Error('Invalid private key');
		}

		return await this.proxyWorkerService.start(config.name, privateKey);
	}

	async stopProxy(configId: number, userId: number) {
		const config = await this.#getUserConfigById(configId, userId);
		return await this.proxyWorkerService.stopByConfig(config.name);
	}

	async restartProxy(configId: number, userId: number) {
		const config = await this.#getUserConfigById(configId, userId);
		const privateKey = this.#getDecryptedPrivateKey(config);
		if (!privateKey) {
			throw new Error('Invalid private key');
		}

		return await this.proxyWorkerService.restart(config.name, privateKey);
	}

	async testProxy(configId: number, userId: number) {
		const config = await this.#getUserConfigById(configId, userId);
		return await this.proxyWorkerService.testProxy(config.name);
	}

	async startAllProxies(userId: number) {
		const configs = await this.#getUserConfigs(userId);
		for (const config of configs) {
			const privateKey = this.#getDecryptedPrivateKey(config);
			if (!privateKey) continue;
			await this.proxyWorkerService.start(config.name, privateKey);
		}
	}

	async stopAllProxies(userId: number) {
		const configs = await this.#getUserConfigs(userId);
		return Promise.all(
			configs.map((config) => this.proxyWorkerService.stopByConfig(config.name))
		);
	}

	async restartAllProxies(userId: number) {
		await this.stopAllProxies(userId);
		await this.startAllProxies(userId);
	}

	async testAllProxies(userId: number) {
		const configs = await this.#getUserConfigs(userId);
		return Promise.all(
			configs.map((config) => this.proxyWorkerService.testProxy(config.name))
		);
	}

	#getDecryptedPrivateKey(config: WireguardConfig): string | null {
		return this.configService.getDecryptedPrivateKey(config);
	}

	async #getUserConfigs(userId: number) {
		const configs = await WireguardConfig.query()
			.where({ userId })
			.orderBy('name', 'asc');
		if (configs.length === 0) {
			throw new Error('No configs found');
		}

		return configs;
	}

	#getUserConfigById(configId: number, userId: number) {
		return WireguardConfig.query()
			.where({ id: configId, userId })
			.orderBy('name', 'asc')
			.firstOrFail();
	}
}
