import type { Data } from '@generated/data';
import { Head, router } from '@inertiajs/react';
import { Button } from '@minimalstuff/ui';
import { useState } from 'react';
import { UploadConfigForm } from '~/components/configs/upload_config_form';

type ActiveProxy = {
	id: string;
	name: string;
	configName: string;
	port: number;
};

type TestResult = { ok: true; ip: string } | { ok: false; error: string };

type HomeProps = {
	configs: Data.Config[];
	activeProxies: ActiveProxy[];
};

export default function Home({
	configs,
	activeProxies = [],
}: Readonly<HomeProps>) {
	const [testState, setTestState] = useState<{
		configName: string | null;
		loading: boolean;
		result: TestResult | null;
	}>({ configName: null, loading: false, result: null });

	const startProxy = (configName: string) => {
		router.post('/proxies/start', { configName }, { preserveScroll: true });
	};

	const stopProxy = (configName: string) => {
		router.post('/proxies/stop', { configName }, { preserveScroll: true });
	};

	const restartProxy = (configName: string) => {
		router.post('/proxies/restart', { configName }, { preserveScroll: true });
	};

	const startAll = () => {
		router.post('/proxies/start-all', {}, { preserveScroll: true });
	};

	const stopAll = () => {
		router.post('/proxies/stop-all', {}, { preserveScroll: true });
	};

	const restartAll = () => {
		router.post('/proxies/restart-all', {}, { preserveScroll: true });
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
		activeProxies.find((p) => p.configName === configName);

	const deleteConfig = (id: number) => {
		router.delete(`/configs/${id}`, { preserveScroll: true });
	};

	return (
		<>
			<Head title="Homepage" />
			<div className="flex flex-col gap-8">
				<div>
					<h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
						Configs
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Add WireGuard configs by selecting .conf files. Content is stored in
						your account.
					</p>
				</div>
				<UploadConfigForm />
				<div>
					<div className="mb-2 flex flex-wrap items-center justify-between gap-2">
						<h2 className="text-lg font-medium text-gray-900 dark:text-white">
							Stored configs & proxy workers
						</h2>
						{configs.length > 0 && (
							<div className="flex flex-wrap gap-2">
								<Button type="button" variant="primary" onClick={startAll}>
									Start all
								</Button>
								<Button type="button" variant="secondary" onClick={restartAll}>
									Restart all
								</Button>
								<Button type="button" variant="danger" onClick={stopAll}>
									Stop all
								</Button>
							</div>
						)}
					</div>
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
										key={c.id}
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
													onClick={() => restartProxy(c.name)}
													variant="secondary"
												>
													Restart
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
										<Button
											type="button"
											onClick={() => deleteConfig(c.id)}
											variant="danger"
											className="ml-auto"
										>
											Remove
										</Button>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</div>
		</>
	);
}
