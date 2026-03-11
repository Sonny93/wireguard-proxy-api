import http from 'node:http';

export class HttpProxyClient {
	async get(
		proxyHost: string,
		proxyPort: number,
		requestUrl: string,
		timeoutMs: number
	): Promise<string> {
		const url = new URL(requestUrl);
		return new Promise((resolve, reject) => {
			const req = http.request(
				{
					host: proxyHost,
					port: proxyPort,
					method: 'GET',
					path: url.toString(),
					headers: {
						Host: url.host,
						Connection: 'close',
					},
					timeout: timeoutMs,
				},
				(res) => {
					const chunks: Buffer[] = [];

					res.on('data', (chunk) => {
						chunks.push(chunk as Buffer);
					});

					res.on('end', () => {
						const { statusCode } = res;

						if (!statusCode || statusCode !== 200) {
							reject(new Error(`HTTP ${statusCode ?? 0}`));
							return;
						}

						const body = Buffer.concat(chunks).toString('utf8');
						resolve(body);
					});
				}
			);

			req.on('timeout', () => {
				req.destroy(new Error(`Timeout after ${timeoutMs}ms`));
			});

			req.on('error', (err) => {
				reject(err);
			});

			req.end();
		});
	}
}
