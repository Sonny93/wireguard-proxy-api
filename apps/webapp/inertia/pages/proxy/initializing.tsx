import { Head } from '@inertiajs/react';

const Initializing = () => (
	<div className="flex flex-col items-center justify-center h-screen">
		<Head title="Proxy initializing" />
		<div className="flex flex-col gap-2">
			<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
				Proxy initializing
			</h1>
			<p className="text-gray-600 dark:text-gray-300">
				Pulling required Docker image. This may take a moment.
			</p>
		</div>
	</div>
);

export default Initializing;
