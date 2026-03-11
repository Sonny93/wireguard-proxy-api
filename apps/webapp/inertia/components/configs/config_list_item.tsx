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
		const deleteUrl = urlFor('configs.destroy', { id });
		router.delete(deleteUrl, { preserveScroll: true });
	};

	const proxy = getProxyForConfig(config.name);

	return (
		<li className="flex flex-wrap items-center gap-2 rounded border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50">
			<span className="font-mono text-sm text-gray-700 dark:text-gray-300">
				{config.name}
			</span>
			{proxy ? (
				<>
					<span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/40 dark:text-green-300">
						Proxy port {proxy.port}
					</span>
					<Button
						type="button"
						onClick={testProxy}
						variant="secondary"
						disabled={testHttp.processing}
					>
						{testHttp.processing ? 'Testing…' : 'Test'}
					</Button>
					<Button
						type="button"
						onClick={() => restartProxy(config.name)}
						variant="secondary"
						disabled={testHttp.processing}
					>
						Restart
					</Button>
					<Button
						type="button"
						onClick={() => stopProxy(config.name)}
						variant="danger"
						disabled={testHttp.processing}
					>
						Stop
					</Button>
					{testResult && (
						<span
							className={
								testResult?.ok
									? 'text-sm text-green-700 dark:text-green-400'
									: 'text-sm text-red-600 dark:text-red-400'
							}
						>
							{testResult?.ok ? `Exit IP: ${testResult.ip}` : testResult?.error}
						</span>
					)}
				</>
			) : (
				<Button
					type="button"
					onClick={() => startProxy(config.name)}
					variant="primary"
					disabled={testHttp.processing}
				>
					Start proxy
				</Button>
			)}
			<Button
				type="button"
				onClick={() => deleteConfig(config.id)}
				variant="danger"
				className="ml-auto"
				disabled={testHttp.processing}
			>
				Remove
			</Button>
		</li>
	);
}
