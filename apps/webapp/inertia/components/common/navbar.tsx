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

const AppLogo = () => <div className="h-auto w-30">App Logo</div>;

export const Navbar = () => {
	const { user } = usePage().props as PageProps;
	const { post, processing } = useForm();

	return (
		<nav className="flex h-[64px] max-w-[1920px] items-center justify-between rounded-md bg-white py-2 px-6 dark:bg-gray-800">
			<div className="flex items-center gap-6">
				<Link
					href="/"
					className="mr-6 flex-shrink-0 text-2xl text-gray-900 dark:text-white"
				>
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
