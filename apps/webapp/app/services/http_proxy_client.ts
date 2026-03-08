import net from 'node:net';

function parseHttpStatusLine(headerSection: string): number {
	const match = /^HTTP\/\d\.\d (\d+)/.exec(headerSection);
	return match ? Number.parseInt(match[1], 10) : 0;
}

function parseContentLength(headerSection: string): number {
	const match = /content-length:\s*(\d+)/i.exec(headerSection);
	return match ? Number.parseInt(match[1], 10) : 0;
}

function buildHttpGetRequest(url: URL): string {
	return [
		`GET ${url.toString()} HTTP/1.1`,
		`Host: ${url.host}`,
		'Connection: close',
		'',
		'',
	].join('\r\n');
}

export class HttpProxyClient {
	async get(
		proxyHost: string,
		proxyPort: number,
		requestUrl: string,
		timeoutMs: number
	): Promise<string> {
		const url = new URL(requestUrl);
		const request = buildHttpGetRequest(url);

		return new Promise((resolve, reject) => {
			let sock: net.Socket;
			const timer = setTimeout(() => {
				sock.destroy();
				reject(new Error(`Timeout after ${timeoutMs}ms`));
			}, timeoutMs);

			const cleanup = () => {
				clearTimeout(timer);
				sock.destroy();
			};

			sock = net.connect({ host: proxyHost, port: proxyPort }, () =>
				sock.write(request)
			);

			sock.on('error', (err) => {
				cleanup();
				reject(err);
			});

			let buffer = '';
			sock.on('data', (chunk) => {
				buffer += chunk.toString('binary');
				const headerEnd = buffer.indexOf('\r\n\r\n');
				if (headerEnd === -1) return;

				const headers = buffer.slice(0, headerEnd);
				const bodyStart = headerEnd + 4;
				const status = parseHttpStatusLine(headers);
				if (status !== 200) {
					cleanup();
					reject(new Error(`HTTP ${status}`));
					return;
				}

				const bodyLen = parseContentLength(headers);
				const hasFullBody =
					bodyLen === 0 || buffer.length >= bodyStart + bodyLen;
				if (!hasFullBody) return;

				cleanup();
				const body =
					bodyLen > 0
						? buffer.slice(bodyStart, bodyStart + bodyLen)
						: buffer.slice(bodyStart);
				resolve(body);
			});
		});
	}
}
