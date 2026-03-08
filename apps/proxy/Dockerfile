# https://hub.docker.com/_/node/tags
FROM node:24.13-alpine3.22 AS base

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache \
        bash \
        ca-certificates \
        dumb-init \
        iproute2 \
        iptables \
        procps \
        wireguard-tools
ENV NODE_ENV=production \
    WG_CONFIG=/vpn/wg0.conf \
    PROXY_PORT=3128
RUN mkdir -p /vpn /etc/wireguard /app

WORKDIR /app

COPY scripts/entrypoint.sh /entrypoint.sh
COPY scripts/resolvconf-noop /usr/local/bin/resolvconf
COPY scripts/sysctl-wrapper /usr/local/sbin/sysctl
RUN chmod +x /entrypoint.sh /usr/local/bin/resolvconf /usr/local/sbin/sysctl

FROM base AS deps
COPY package.json ./
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src

RUN pnpm run build && pnpm prune --prod

FROM base AS runtime
COPY package.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3128

ENTRYPOINT ["/usr/bin/dumb-init", "--", "/entrypoint.sh"]
