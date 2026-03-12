import { Link, useForm, usePage } from '@inertiajs/react';
import { ThemeToggle } from '@minimalstuff/ui';

type User = {
	id: number;
	fullName: string | null;
	email: string;
};

type PageProps = {
	user: User | undefined;
};

const AppLogo = () => <span className="hidden sm:inline">WireGuard Proxy</span>;

export const Navbar = () => {
	const { user } = usePage().props as PageProps;
	const { post, processing } = useForm();

	return (
		<nav className="flex h-14 items-center justify-between rounded-xl border border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-6">
			<div className="flex items-center gap-6">
				<Link
					href="/"
					className="flex shrink-0 items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white"
				>
					<span className="i-mdi:server-network w-6 h-6 text-blue-600 dark:text-blue-400" />
					<AppLogo />
				</Link>
			</div>
			<div className="flex items-center gap-4">
				{user ? (
					<>
						<span className="text-gray-500 dark:text-gray-400">
							{user.fullName ?? user.email}
						</span>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								post('/logout');
							}}
							className="inline"
						>
							<button
								type="submit"
								disabled={processing}
								className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>
								Sign out
							</button>
						</form>
					</>
				) : (
					<Link
						href="/login"
						className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
					>
						Sign in
					</Link>
				)}
				<ThemeToggle />
			</div>
		</nav>
	);
};
