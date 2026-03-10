import type { ActiveProxy, TestProxyResult } from './types.js';

export type WireGuardProxyClientOptions = {
	baseUrl: string;
	proxyHost?: string;
};

function trimTrailingSlash(url: string): string {
	return url.replace(/\/+$/, '');
}

function hostFromUrl(url: string): string {
	try {
		return new URL(url).hostname;
	} catch {
		return '127.0.0.1';
	}
}

export class WireGuardProxyClient {
	readonly #baseUrl: string;
	readonly #proxyHost: string;

	constructor(options: WireGuardProxyClientOptions) {
		this.#baseUrl = trimTrailingSlash(options.baseUrl);
		this.#proxyHost = options.proxyHost ?? hostFromUrl(options.baseUrl);
	}

	#headers(): HeadersInit {
		return {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		};
	}

	async #get<T>(path: string): Promise<T> {
		const res = await fetch(`${this.#baseUrl}${path}`, {
			method: 'GET',
			headers: this.#headers(),
		});
		if (!res.ok) {
			throw new Error(`API error: ${res.status} ${res.statusText}`);
		}
		return res.json() as Promise<T>;
	}

	proxyUrl(proxy: ActiveProxy): string {
		return `http://${this.#proxyHost}:${proxy.port}`;
	}

	async listProxies(): Promise<{ proxies: ActiveProxy[] }> {
		return this.#get<{ proxies: ActiveProxy[] }>('/api/proxies');
	}

	async pickProxy(): Promise<{ proxy: ActiveProxy | null }> {
		return this.#get<{ proxy: ActiveProxy | null }>('/api/proxies/pick');
	}

	async testProxy(configName: string): Promise<TestProxyResult> {
		const encoded = encodeURIComponent(configName);
		return this.#get<TestProxyResult>(`/api/proxies/${encoded}/test`);
	}
}
