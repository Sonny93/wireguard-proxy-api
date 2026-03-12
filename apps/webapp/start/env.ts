import { Env } from '@adonisjs/core/env';

export default await Env.create(new URL('../', import.meta.url), {
	// App variables
	TZ: Env.schema.string(),
	PORT: Env.schema.number(),
	HOST: Env.schema.string({ format: 'host' }),
	LOG_LEVEL: Env.schema.string(),
	APP_KEY: Env.schema.string(),
	NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
	SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

	// Proxy variables
	DOCKER_SOCKET_PATH: Env.schema.string(),
	PROXY_TEST_HOST: Env.schema.string(),
	PROXY_BASE_HOST_PORT: Env.schema.string(),
	PROXY_NETWORK_NAME: Env.schema.string.optionalWhen(
		() => process.env.NODE_ENV !== 'production'
	),

	// Gluetun variables
	GLUETUN_IMAGE_NAME: Env.schema.string(),
	VPN_SERVICE_PROVIDER: Env.schema.string(),
	VPN_TYPE: Env.schema.string(),
});
