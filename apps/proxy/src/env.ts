import { z } from "zod";

const logLevels = ["trace", "debug", "info", "warn", "error", "fatal"] as const;

const envSchema = z.object({
	PROXY_PORT: z
		.string()
		.optional()
		.transform((v) =>
			v === undefined || v === "" ? 3128 : Number.parseInt(v, 10)
		)
		.pipe(z.number().int().min(1).max(65535)),
	LOG_LEVEL: z
		.enum(logLevels)
		.optional()
		.default("info"),
	LOG_FILE: z
		.string()
		.min(1)
		.optional(),
	NODE_ENV: z
		.string()
		.optional(),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
	const result = envSchema.safeParse(process.env);
	if (!result.success) {
		const issues = result.error.issues
			.map((i) => `  ${i.path.join(".")}: ${i.message}`)
			.join("\n");
		console.error("Invalid environment:\n" + issues);
		process.exit(1);
	}
	return result.data;
}
