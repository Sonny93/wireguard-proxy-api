import http from "node:http";
import net from "node:net";
import { URL } from "node:url";
import pino from "pino";
import { loadEnv } from "./env.js";

const env = loadEnv();
const { PROXY_PORT: PORT, LOG_LEVEL, LOG_FILE } = env;
const isProduction = env.NODE_ENV === "production";

const logger = LOG_FILE
	? pino(
			{ level: LOG_LEVEL },
			pino.destination({ dest: LOG_FILE, append: true, mkdir: true })
		)
	: pino({
			level: LOG_LEVEL,
			...(isProduction
				? {}
				: {
						transport: {
							target: "pino-pretty",
							options: { colorize: true },
						},
					}),
		});

function logRequest(
	method: string,
	url: string,
	statusCode?: number,
	target?: string
): void {
	logger.info({
		method,
		url,
		...(statusCode !== undefined && { statusCode }),
		...(target !== undefined && { target }),
	});
}

function onRequest(
	clientReq: http.IncomingMessage,
	clientRes: http.ServerResponse
): void {
	const method = clientReq.method ?? "GET";
	const url = clientReq.url ?? "/";

	const CONNECT_TIMEOUT_MS = 15_000;

	if (method === "CONNECT") {
		logRequest(method, url, undefined, url);
		const [host, portStr] = url.split(":");
		const port = Number.parseInt(portStr ?? "443", 10);
		const targetSocket = net.connect(port, host, () => {
			targetSocket.setTimeout(0);
			clientRes.writeHead(200, { Connection: "keep-alive" });
			clientRes.end();
			const clientSocket = clientReq.socket!;
			clientSocket.pipe(targetSocket);
			targetSocket.pipe(clientSocket);
		});
		targetSocket.setTimeout(CONNECT_TIMEOUT_MS, () => {
			targetSocket.destroy(new Error("Connection to target timed out"));
		});
		targetSocket.on("error", (err) => {
			if (!clientRes.writableEnded) {
				clientRes.writeHead(502, { "Content-Type": "text/plain" });
				clientRes.end(`Bad Gateway: ${err.message}`);
			}
			clientReq.socket?.destroy();
		});
		clientReq.on("error", () => targetSocket.destroy());
		clientReq.socket?.on("error", () => targetSocket.destroy());
		return;
	}

	const hostHeader = clientReq.headers.host;
	if (!hostHeader) {
		logRequest(method, url, 400);
		clientRes.writeHead(400, { "Content-Type": "text/plain" });
		clientRes.end("Missing Host header");
		return;
	}

	let targetPath = url;
	let targetHost = hostHeader;
	if (url.startsWith("http://") || url.startsWith("https://")) {
		try {
			const parsed = new URL(url);
			targetHost = parsed.host;
			targetPath = parsed.pathname + parsed.search;
		} catch {
			logRequest(method, url, 400);
			clientRes.writeHead(400, { "Content-Type": "text/plain" });
			clientRes.end("Invalid request URL");
			return;
		}
	}

	const colon = targetHost.lastIndexOf(":");
	const hostname = colon > 0 ? targetHost.slice(0, colon) : targetHost;
	const port =
		colon > 0 ? Number.parseInt(targetHost.slice(colon + 1), 10) : 80;
	const targetPort = Number.isNaN(port) ? 80 : port;
	const isSelf =
		(hostname === "localhost" || hostname === "127.0.0.1") &&
		targetPort === PORT;
	if (isSelf) {
		logRequest(method, url, 200, "self");
		const body = "Proxy is running.";
		clientRes.writeHead(200, {
			"Content-Type": "text/plain",
			"Content-Length": Buffer.byteLength(body),
			Connection: "keep-alive",
		});
		clientRes.end(body);
		return;
	}
	const opts: http.RequestOptions = {
		method,
		path: targetPath,
		headers: { ...clientReq.headers, host: targetHost },
		hostname,
		port: targetPort,
	};
	const proxyReq = http.request(opts, (proxyRes) => {
		const status = proxyRes.statusCode ?? 200;
		clientRes.on("finish", () =>
			logRequest(method, url, status, `${hostname}:${targetPort}${targetPath}`)
		);
		clientRes.writeHead(status, proxyRes.headers);
		proxyRes.pipe(clientRes);
	});
	proxyReq.on("error", (err) => {
		logRequest(method, url, 502, `${hostname}:${targetPort}${targetPath}`);
		clientRes.writeHead(502, { "Content-Type": "text/plain" });
		clientRes.end(`Bad Gateway: ${err.message}`);
	});
	clientReq.on("error", () => proxyReq.destroy());
	clientRes.on("error", () => proxyReq.destroy());
	clientReq.pipe(proxyReq);
}

const server = http.createServer(onRequest);
server.on("error", (err) => {
	logger.error({ err }, "server error");
	process.exit(1);
});
server.listen(PORT, () => {
	logger.info({ port: PORT }, "HTTP proxy listening");
});
