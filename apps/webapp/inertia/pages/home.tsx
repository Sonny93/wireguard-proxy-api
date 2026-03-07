import { Head, router } from '@inertiajs/react';

type Config = { name: string };

type HomeProps = {
	configs: Config[];
	errors: Partial<Record<string, string>>;
};

const Home = ({ configs, errors }: HomeProps) => {
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
					<button
						type="submit"
						className="w-fit rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
					>
						Upload
					</button>
				</form>
				<div>
					<h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
						Stored configs
					</h2>
					{configs.length === 0 ? (
						<p className="text-gray-500 dark:text-gray-400">
							No config files yet.
						</p>
					) : (
						<ul className="list-inside list-disc text-gray-700 dark:text-gray-300">
							{configs.map((c) => (
								<li key={c.name}>{c.name}</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</>
	);
};

export default Home;
