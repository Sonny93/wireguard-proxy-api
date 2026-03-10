export type ActiveProxy = {
	id: string;
	name: string;
	configFile: string;
	port: number;
};

export type TestProxyResult =
	| { ok: true; ip: string }
	| { ok: false; error: string };
