import { useForm } from '@inertiajs/react';
import { Button } from '@minimalstuff/ui';
import { useRef, useState } from 'react';
import { partition } from '~/lib/partition';
import { urlFor } from '~/lib/tuyau';
import { extractContentFromFileList } from '~/lib/wireguard-conf';

type FormData = {
	configs: { name: string; privateKey: string }[];
};

export function CreateConfigForm() {
	const inputRef = useRef<HTMLInputElement>(null);
	const form = useForm<FormData>({
		configs: [],
	});
	const [fileErrors, setFileErrors] = useState<string[]>([]);

	const handleReset = () => {
		handleResetErrors();
		handleResetForm();
	};

	const handleResetErrors = () => {
		setFileErrors([]);
		form.clearErrors();
	};

	const handleResetForm = () => {
		form.reset();
		if (inputRef.current) {
			inputRef.current.value = '';
		}
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		handleResetErrors();

		const files = e.target.files;
		if (!files || files.length === 0) {
			return;
		}

		const processedFiles = await extractContentFromFileList(files);
		const [failed, success] = partition(
			processedFiles,
			(r): r is { error: string } => 'error' in r
		);

		setFileErrors(failed.map((f) => f.error));
		form.setData('configs', success);
	};

	const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const createUrl = urlFor('configs.create');
		form.post(createUrl, {
			onSuccess: handleReset,
		});
	};

	return (
		<form onSubmit={submit} className="flex flex-col gap-4">
			<div>
				<label
					htmlFor="configs"
					className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					Config files (.conf)
				</label>
				<div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 transition-colors dark:border-gray-600 dark:bg-gray-800/30 has-[:focus]:border-blue-400 has-[:focus]:bg-blue-50/50 dark:has-[:focus]:border-blue-500 dark:has-[:focus]:bg-blue-900/20">
					<input
						id="configs"
						name="configs"
						type="file"
						accept=".conf"
						multiple
						className="w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:transition-colors hover:file:bg-blue-700 dark:text-gray-400 dark:file:bg-blue-500 dark:hover:file:bg-blue-600"
						onChange={handleFileChange}
						ref={inputRef}
					/>
					{form.data.configs.length > 0 && (
						<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
							{form.data.configs.length} file(s) selected
						</p>
					)}
				</div>
				{fileErrors.length > 0 && (
					<ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-red-600 dark:text-red-400">
						{fileErrors.map((error) => (
							<li key={error}>{error}</li>
						))}
					</ul>
				)}
			</div>
			<div className="flex flex-wrap gap-2">
				<Button
					type="submit"
					variant="primary"
					disabled={form.processing ?? fileErrors.length > 0}
				>
					{form.processing ? 'Adding…' : 'Add configs'}
				</Button>
				<Button
					type="button"
					variant="secondary"
					disabled={form.data.configs.length === 0}
					onClick={handleReset}
				>
					Reset
				</Button>
			</div>
		</form>
	);
}
