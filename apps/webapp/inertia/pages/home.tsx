import type { Data } from '@generated/data';
import { Head, router } from '@inertiajs/react';
import { Button } from '@minimalstuff/ui';
import { ConfigList } from '~/components/configs/config_list';
import { CreateConfigForm } from '~/components/configs/create_config_form';
import { urlFor } from '~/lib/tuyau';

export type ActiveProxy = {
	id: string;
	name: string;
	configName: string;
	port: number;
};

type HomeProps = {
	configs: Data.Config[];
	activeProxies: ActiveProxy[];
};

export default function Home({
	configs,
	activeProxies = [],
}: Readonly<HomeProps>) {
	const startAll = () => {
		const startAllUrl = urlFor('proxies.all.start');
		router.post(startAllUrl, {}, { preserveScroll: true });
	};

	const stopAll = () => {
		const stopAllUrl = urlFor('proxies.all.stop');
		router.post(stopAllUrl, {}, { preserveScroll: true });
	};

	const restartAll = () => {
		const restartAllUrl = urlFor('proxies.all.restart');
		router.post(restartAllUrl, {}, { preserveScroll: true });
	};

	return (
		<>
			<Head title="Homepage" />
			<div className="flex flex-col gap-8 pb-8">
				<header>
					<h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
						Configs
					</h1>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Add WireGuard configs by selecting .conf files. Content is stored in
						your account.
					</p>
				</header>

				<section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
					<h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
						Add configs
					</h2>
					<CreateConfigForm />
				</section>

				<section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
					<div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-700">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							Stored configs & proxy workers
						</h2>
						{configs.length > 0 && (
							<div className="flex flex-wrap gap-2">
								<Button
									type="button"
									variant="primary"
									onClick={startAll}
									size="sm"
								>
									Start all
								</Button>
								<Button
									type="button"
									variant="secondary"
									onClick={restartAll}
									size="sm"
								>
									Restart all
								</Button>
								<Button
									type="button"
									variant="danger"
									onClick={stopAll}
									size="sm"
								>
									Stop all
								</Button>
							</div>
						)}
					</div>
					<div className="p-4 sm:p-6">
						{configs.length === 0 ? (
							<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-12 dark:border-gray-600">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									No config files yet.
								</p>
								<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
									Add .conf files above to get started.
								</p>
							</div>
						) : (
							<ConfigList configs={configs} activeProxies={activeProxies} />
						)}
					</div>
				</section>
			</div>
		</>
	);
}
