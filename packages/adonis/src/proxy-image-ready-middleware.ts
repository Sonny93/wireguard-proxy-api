import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import { ProxyWorkerService } from '@wireguard-proxy/core';

export type ProxyImageReadyMiddlewareOptions = {
	initializingPath?: string;
	skipPaths?: string[];
};

const DEFAULT_INITIALIZING_PATH = '/proxy/initializing';
const DEFAULT_SKIP_PATHS = ['/login'];

function pathMatches(url: string, path: string): boolean {
	const pathname = new URL(url, 'http://localhost').pathname;
	return pathname === path || pathname.startsWith(path + '/');
}

export function createProxyImageReadyMiddleware(
	options: ProxyImageReadyMiddlewareOptions = {}
) {
	const initializingPath =
		options.initializingPath ?? DEFAULT_INITIALIZING_PATH;
	const skipPaths = options.skipPaths ?? DEFAULT_SKIP_PATHS;

	class ProxyImageReadyMiddleware {
		async handle(ctx: HttpContext, next: NextFn) {
			const proxyWorkerService = await ctx.containerResolver.make(
				ProxyWorkerService
			);
			const url = ctx.request.url();
			const isInitializingUrl = pathMatches(url, initializingPath);
			const isSkippedPath = skipPaths.some((p) => pathMatches(url, p));

			const imageReady = await proxyWorkerService.isImageReady();

			if (!imageReady) {
				proxyWorkerService.ensureImageReady().catch(() => {});
			}

			if (!imageReady && !isInitializingUrl && !isSkippedPath) {
				return ctx.response.redirect(
					`${initializingPath}?redirect=${encodeURIComponent(url)}`,
					true
				);
			}
			if (imageReady && isInitializingUrl) {
				const redirectUrl = ctx.request.input('redirect', '/');
				return ctx.response.redirect(redirectUrl);
			}
			return await next();
		}
	}

	return ProxyImageReadyMiddleware;
}
