import { ConfigService } from '#services/config_service';
import { inject } from '@adonisjs/core';
import { ProxyWorkerService } from '@wireguard-proxy/core';

@inject()
export class ProxyService {
	constructor(
		private readonly proxyWorkerService: ProxyWorkerService,
		private readonly configService: ConfigService
	) {}

	async startUserProxy(configId: number, userId: number) {
		const config = await this.configService.getUserConfigById(configId, userId);

		const privateKey = this.configService.getDecryptedPrivateKey(config);
		if (!privateKey) {
			throw new Error('Invalid private key');
		}

		return await this.proxyWorkerService.start(config.name, privateKey);
	}

	async stopUserProxy(configId: number, userId: number) {
		const config = await this.configService.getUserConfigById(configId, userId);
		return await this.proxyWorkerService.stopByConfig(config.name);
	}

	async restartUserProxy(configId: number, userId: number) {
		const config = await this.configService.getUserConfigById(configId, userId);
		const privateKey = this.configService.getDecryptedPrivateKey(config);
		if (!privateKey) {
			throw new Error('Invalid private key');
		}

		return await this.proxyWorkerService.restart(config.name, privateKey);
	}

	async testUserProxy(configId: number, userId: number) {
		const config = await this.configService.getUserConfigById(configId, userId);
		return await this.proxyWorkerService.testProxy(config.name);
	}

	async startUserProxies(userId: number) {
		const configs = await this.configService.getUserConfigs(userId);
		for (const config of configs) {
			const privateKey = this.configService.getDecryptedPrivateKey(config);
			if (!privateKey) continue;
			await this.proxyWorkerService.start(config.name, privateKey);
		}
	}

	async stopUserProxies(userId: number) {
		const configs = await this.configService.getUserConfigs(userId);
		return Promise.all(
			configs.map((config) => this.proxyWorkerService.stopByConfig(config.name))
		);
	}

	async restartUserProxies(userId: number) {
		await this.stopUserProxies(userId);
		await this.startUserProxies(userId);
	}

	async testUserProxies(userId: number) {
		const configs = await this.configService.getUserConfigs(userId);
		return Promise.all(
			configs.map((config) => this.proxyWorkerService.testProxy(config.name))
		);
	}
}
