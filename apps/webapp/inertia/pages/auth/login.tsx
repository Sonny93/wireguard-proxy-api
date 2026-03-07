import { Head, useForm, usePage } from '@inertiajs/react';

type PageProps = {
	flash: { error?: string };
};

const Login = () => {
	const { flash } = usePage().props as PageProps;
	const { data, setData, post, processing, errors } = useForm({
		email: '',
		password: '',
	});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post('/login');
	};

	return (
		<>
			<Head title="Sign in" />
			<div className="mx-auto flex max-w-sm flex-col gap-6">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Sign in
				</h1>
				{flash?.error && (
					<p className="rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
						{flash.error}
					</p>
				)}
				<form onSubmit={submit} className="flex flex-col gap-4">
					<div>
						<label
							htmlFor="email"
							className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							value={data.email}
							onChange={(e) => setData('email', e.target.value)}
							className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							autoComplete="email"
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">
								{errors.email}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="password"
							className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={data.password}
							onChange={(e) => setData('password', e.target.value)}
							className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							autoComplete="current-password"
						/>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">
								{errors.password}
							</p>
						)}
					</div>
					<button
						type="submit"
						disabled={processing}
						className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{processing ? 'Signing in…' : 'Sign in'}
					</button>
				</form>
			</div>
		</>
	);
};

export default Login;
