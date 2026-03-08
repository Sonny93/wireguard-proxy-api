import { Head, router } from '@inertiajs/react';
import { Button } from '@minimalstuff/ui';
import { useState } from 'react';

type Config = { name: string };

type ActiveProxy = {
	id: string;
	name: string;
	configFile: string;
	port: number;
};

type TestResult = { ok: true; ip: string } | { ok: false; error: string };

type HomeProps = {
	configs: Config[];
	activeProxies: ActiveProxy[];
	errors: Partial<Record<string, string>>;
};

const Home = ({ configs, activeProxies = [], errors = {} }: HomeProps) => {
	const [testState, setTestState] = useState<{
		configName: string | null;
		loading: boolean;
		result: TestResult | null;
	}>({ configName: null, loading: false, result: null });

	const submit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const input = form.querySelector<HTMLInputElement>('input[name="configs"]');
		if (!input?.files?.length) return;
		const fd = new FormData();
		for (const file of input.files) {
			fd.append('configs', file);
		}
		router.post('/configs', fd, { forceFormData: true });
	};

	const startProxy = (configName: string) => {
		router.post('/proxies/start', { configName }, { preserveScroll: true });
	};

	const stopProxy = (configName: string) => {
		router.post('/proxies/stop', { configName }, { preserveScroll: true });
	};

	const getCsrfToken = (): string | null => {
		const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
		return match ? decodeURIComponent(match[1]) : null;
	};

	const testProxy = async (configName: string) => {
		setTestState({ configName, loading: true, result: null });
		try {
			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			};
			const token = getCsrfToken();
			if (token) headers['X-XSRF-TOKEN'] = token;
			const res = await fetch('/proxies/test', {
				method: 'POST',
				headers,
				body: JSON.stringify({ configName }),
				credentials: 'same-origin',
			});
			const result = (await res.json()) as TestResult;
			setTestState({ configName, loading: false, result });
		} catch {
			setTestState({
				configName,
				loading: false,
				result: { ok: false, error: 'Request failed' },
			});
		}
	};

	const getProxyForConfig = (configName: string) =>
		activeProxies.find((p) => p.configFile === configName);

	return (
		<>
			<Head title="Homepage" />
			<div className="flex flex-col gap-8">
				<div>
					<h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
						Configs
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Upload WireGuard config files (.conf) to storage/configs.
					</p>
				</div>
				<form
					onSubmit={submit}
					encType="multipart/form-data"
					className="flex flex-col gap-3"
				>
					<div>
						<label
							htmlFor="configs"
							className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Config files (.conf)
						</label>
						<input
							id="configs"
							name="configs"
							type="file"
							accept=".conf"
							multiple
							className="w-full text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 dark:text-gray-400 dark:file:bg-blue-900/30 dark:file:text-blue-300"
						/>
						{errors.configs && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">
								{errors.configs}
							</p>
						)}
					</div>
					<Button type="submit" variant="primary">
						Upload
					</Button>
				</form>
				<div>
					<h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
						Stored configs & proxy workers
					</h2>
					{configs.length === 0 ? (
						<p className="text-gray-500 dark:text-gray-400">
							No config files yet.
						</p>
					) : (
						<ul className="flex flex-col gap-2">
							{configs.map((c) => {
								const proxy = getProxyForConfig(c.name);
								return (
									<li
										key={c.name}
										className="flex flex-wrap items-center gap-2 rounded border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50"
									>
										<span className="font-mono text-sm text-gray-700 dark:text-gray-300">
											{c.name}
										</span>
										{proxy ? (
											<>
												<span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/40 dark:text-green-300">
													Proxy port {proxy.port}
												</span>
												<Button
													type="button"
													onClick={() => testProxy(c.name)}
													variant="secondary"
													disabled={testState.loading}
												>
													{testState.loading && testState.configName === c.name
														? 'Testing…'
														: 'Test'}
												</Button>
												<Button
													type="button"
													onClick={() => stopProxy(c.name)}
													variant="danger"
												>
													Stop
												</Button>
												{testState.configName === c.name &&
													testState.result && (
														<span
															className={
																testState.result.ok
																	? 'text-sm text-green-700 dark:text-green-400'
																	: 'text-sm text-red-600 dark:text-red-400'
															}
														>
															{testState.result.ok
																? `Exit IP: ${testState.result.ip}`
																: testState.result.error}
														</span>
													)}
											</>
										) : (
											<Button
												type="button"
												onClick={() => startProxy(c.name)}
												variant="primary"
											>
												Start proxy
											</Button>
										)}
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</div>
		</>
	);
};

export default Home;
