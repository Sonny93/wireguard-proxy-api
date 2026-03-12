import { Data } from '@generated/data';
import { router, useHttp } from '@inertiajs/react';
import { Button } from '@minimalstuff/ui';
import { useState } from 'react';
import { urlFor } from '~/lib/tuyau';
import { ActiveProxy } from '~/pages/home';

type TestResult = { ok: true; ip: string } | { ok: false; error: string };

interface ConfigListItemProps {
	config: Data.Config;
	activeProxies: ActiveProxy[];
}

export function ConfigListItem({
	config,
	activeProxies,
}: Readonly<ConfigListItemProps>) {
	const testHttp = useHttp({
		configName: config.name,
	});
	const [testResult, setTestResult] = useState<TestResult | null>(null);

	const startProxy = (configName: string) => {
		const startUrl = urlFor('proxies.start', { configId: config.id });
		router.post(startUrl, { configName }, { preserveScroll: true });
	};

	const stopProxy = (configName: string) => {
		const stopUrl = urlFor('proxies.stop', { configId: config.id });
		router.post(stopUrl, { configName }, { preserveScroll: true });
	};

	const restartProxy = (configName: string) => {
		const restartUrl = urlFor('proxies.restart', { configId: config.id });
		router.post(restartUrl, { configName }, { preserveScroll: true });
	};

	const testProxy = () => {
		setTestResult(null);
		const testUrl = urlFor('proxies.test', { configId: config.id });
		testHttp.post(testUrl, {
			onSuccess: (response) => {
				setTestResult(response as TestResult);
			},
			onError: (error) => {
				setTestResult({ ok: false, error: error.message });
			},
		});
	};

	const getProxyForConfig = (configName: string) =>
		activeProxies.find((p) => p.configName === configName);

	const deleteConfig = (id: number) => {
		const deleteUrl = urlFor('configs.delete', { configId: id });
		router.delete(deleteUrl, { preserveScroll: true });
	};

	const proxy = getProxyForConfig(config.name);

	return (
		<li className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors dark:border-gray-600 dark:bg-gray-800/30 hover:border-gray-300 dark:hover:border-gray-500">
			<span className="i-mdi:server-network w-5 h-5 shrink-0 text-gray-400 dark:text-gray-500" />
			<span className="min-w-0 font-mono text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
				{config.name}
			</span>
			<div className="flex flex-wrap items-center gap-2">
				{proxy && (
					<span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-300">
						Port {proxy.port}
					</span>
				)}
				{testHttp.processing && (
					<span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
						Testing…
					</span>
				)}
				{testResult && (
					<span
						className={
							testResult?.ok
								? 'text-xs font-medium text-green-700 dark:text-green-400'
								: 'text-xs font-medium text-red-600 dark:text-red-400 max-w-[200px] truncate'
						}
						title={testResult?.ok ? undefined : testResult?.error}
					>
						{testResult?.ok ? `Exit IP: ${testResult.ip}` : testResult?.error}
					</span>
				)}
			</div>
			<div className="flex flex-wrap items-center gap-2 ml-auto">
				{proxy ? (
					<>
						<Button
							type="button"
							onClick={testProxy}
							variant="outline"
							disabled={testHttp.processing}
							size="sm"
						>
							Test
						</Button>
						<Button
							type="button"
							onClick={() => restartProxy(config.name)}
							variant="secondary"
							disabled={testHttp.processing}
							size="sm"
						>
							Restart
						</Button>
						<Button
							type="button"
							onClick={() => stopProxy(config.name)}
							variant="danger"
							disabled={testHttp.processing}
							size="sm"
						>
							Stop
						</Button>
					</>
				) : (
					<Button
						type="button"
						onClick={() => startProxy(config.name)}
						variant="primary"
						disabled={testHttp.processing}
						size="sm"
					>
						Start proxy
					</Button>
				)}
				<span className="w-px self-stretch min-h-6 border-l border-gray-200 dark:border-gray-600" />
				<Button
					type="button"
					onClick={() => deleteConfig(config.id)}
					variant="danger"
					disabled={testHttp.processing}
					size="sm"
				>
					<span className="i-mdi:delete-outline w-4 h-4 shrink-0" />
					<span>Remove</span>
				</Button>
			</div>
		</li>
	);
}
