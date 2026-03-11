const SECTION_INTERFACE = 'interface';
const KEY_PRIVATE = 'PrivateKey';
const KEY_VALUE = /^([^=]+)=(.*)$/;
const BASE64_KEY = /^[A-Za-z0-9+/]+=*$/;

type ExtractContentFromFileListResult = (
	| { name: string; privateKey: string }
	| { error: string }
)[];

export function extractContentFromFileList(
	files: FileList
): Promise<ExtractContentFromFileListResult> {
	const fileArray = Array.from(files);
	const promisedArray = fileArray.map(async (file) => {
		const content = await file.text();
		const name = file.name.replace(/\.conf$/i, '') || file.name;
		const privateKey = extractPrivateKey(content);
		if (!privateKey) {
			return {
				error: `${file.name}: no PrivateKey found in [Interface] section`,
			};
		}

		if (!isValidPrivateKey(privateKey)) {
			return {
				error: `${file.name}: invalid PrivateKey format in [Interface] section`,
			};
		}

		return { name, privateKey };
	});

	return Promise.all(promisedArray);
}

export function extractPrivateKey(content: string): string | null {
	const lines = content.split(/\r?\n/);
	let inInterface = false;

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;

		const sectionMatch = /^\[(\w+)\]$/i.exec(trimmed);
		if (sectionMatch) {
			inInterface = sectionMatch[1].toLowerCase() === SECTION_INTERFACE;
			continue;
		}

		if (!inInterface) continue;

		const match = KEY_VALUE.exec(trimmed);
		if (!match) continue;
		const key = match[1].trim();
		const value = match[2].trim();
		if (key === KEY_PRIVATE && value) return value;
	}

	return null;
}

export function isValidPrivateKey(value: string): boolean {
	return value.length > 0 && BASE64_KEY.test(value);
}
