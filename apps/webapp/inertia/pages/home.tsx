import type { Data } from '@generated/data';
import { Head, router } from '@inertiajs/react';
import { Button } from '@minimalstuff/ui';
import { ConfigList } from '~/components/configs/config_list';
import { UploadConfigForm } from '~/components/configs/upload_config_form';
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
						<ConfigList configs={configs} activeProxies={activeProxies} />
					)}
				</div>
			</div>
		</>
	);
}
