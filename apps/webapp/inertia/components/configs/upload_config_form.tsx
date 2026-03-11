import { useForm } from '@inertiajs/react';
import { Button } from '@minimalstuff/ui';
import { useRef, useState } from 'react';
import { partition } from '~/lib/partition';
import { extractContentFromFileList } from '~/lib/wireguard-conf';

type FormData = {
	configs: { name: string; privateKey: string }[];
};

export function UploadConfigForm() {
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
		form.post('/configs', {
			onSuccess: handleReset,
		});
	};

	return (
		<form onSubmit={submit} className="flex flex-col gap-3">
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
					onChange={handleFileChange}
					ref={inputRef}
				/>
				{fileErrors.length > 0 && (
					<ul className="mt-1 list-disc pl-5 text-sm text-red-600 dark:text-red-400">
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
					disabled={form.processing || fileErrors.length > 0}
					fullWidth
				>
					{form.processing ? 'Adding…' : 'Add configs'}
				</Button>
				<Button
					type="reset"
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
