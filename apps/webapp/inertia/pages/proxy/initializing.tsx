import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

const Initializing = () => {
	useEffect(() => {
		const interval = setInterval(() => {
			router.reload({ only: [] });
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<Head title="Proxy initializing" />
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<p className="text-lg text-gray-700 dark:text-gray-300">
					Building proxy image, please wait…
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					You will be redirected when ready.
				</p>
			</div>
		</>
	);
};

export default Initializing;
