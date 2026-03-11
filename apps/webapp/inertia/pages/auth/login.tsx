import { SharedProps } from '@adonisjs/inertia/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button, Input } from '@minimalstuff/ui';

const Login = () => {
	const { flash } = usePage<SharedProps>().props;
	const { data, setData, post, processing, errors } = useForm({
		email: '',
		password: '',
	});

	const submit = (e: React.SubmitEvent) => {
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
					<Input
						id="email"
						type="email"
						label="Email"
						placeholder="Email"
						value={data.email}
						onChange={(e) => setData('email', e.target.value)}
						autoComplete="email"
						error={errors.email}
					/>
					<Input
						id="password"
						type="password"
						label="Password"
						placeholder="Password"
						value={data.password}
						onChange={(e) => setData('password', e.target.value)}
						autoComplete="current-password"
						error={errors.password}
					/>
					<Button type="submit" disabled={processing}>
						{processing ? 'Signing in…' : 'Sign in'}
					</Button>
				</form>
			</div>
		</>
	);
};

export default Login;
