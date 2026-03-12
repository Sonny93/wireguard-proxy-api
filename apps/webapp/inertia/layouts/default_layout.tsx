import { Footer } from '~/components/common/footer';
import { Navbar } from '~/components/common/navbar';
import { BaseLayout } from '~/layouts/base_layout';

export const DefaultLayout = ({ children }: React.PropsWithChildren) => (
	<BaseLayout>
		<div className="flex min-h-dvh flex-col bg-gray-50 dark:bg-gray-900">
			<div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
				<Navbar />
				<main className="flex-1 min-h-0">{children}</main>
				<Footer />
			</div>
		</div>
	</BaseLayout>
);
