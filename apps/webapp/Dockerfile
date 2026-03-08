# https://hub.docker.com/_/node/tags
# Source : https://github.com/adonisjs-community/adonis-packages/blob/main/Dockerfile

FROM node:24.14-alpine3.22 AS base

RUN apk --no-cache add curl g++ make python3 && corepack enable

# All deps stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --ignore-scripts --frozen-lockfile
RUN pnpm rebuild better-sqlite3

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --ignore-scripts --prod --frozen-lockfile
RUN pnpm rebuild better-sqlite3

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN node ace build

# Production stage
FROM base

ENV NODE_ENV=production
ENV LOG_LEVEL=debug
ENV CACHE_VIEWS=false
ENV SESSION_DRIVER=cookie
ENV PORT=$PORT

WORKDIR /app
RUN mkdir -p /app/tmp
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

# Expose port
EXPOSE $PORT

COPY scripts/entrypoint.sh /app/scripts/entrypoint.sh
RUN chmod +x /app/scripts/entrypoint.sh

CMD ["/app/scripts/entrypoint.sh"]
