import type { ProxyService } from '#services/proxy_service';

declare module '@adonisjs/core/types' {
	export interface ContainerBindings {
		proxyservice: ProxyService;
	}
}
