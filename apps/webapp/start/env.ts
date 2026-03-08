import { Env } from '@adonisjs/core/env';

export default await Env.create(new URL('../', import.meta.url), {
	NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
	PORT: Env.schema.number(),
	APP_KEY: Env.schema.string(),
	HOST: Env.schema.string({ format: 'host' }),
	LOG_LEVEL: Env.schema.string(),

	DRIVE_DISK: Env.schema.enum(['fs'] as const),

	/*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
	SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

	STORAGE_CONFIGS_PATH: Env.schema.string.optional(),

	PROXY_IMAGE_NAME: Env.schema.string.optional(),
	PROXY_BUILD_CONTEXT_PATH: Env.schema.string.optional(),
	DOCKER_SOCKET_PATH: Env.schema.string.optional(),
	PROXY_TEST_HOST: Env.schema.string.optional(),
});
