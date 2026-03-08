export type Logger = {
	debug(message: string, data?: Record<string, unknown>): void;
	info(message: string, data?: Record<string, unknown>): void;
	error(message: string, data?: Record<string, unknown>): void;
};

export const noopLogger: Logger = {
	debug: () => {},
	info: () => {},
	error: () => {},
};
