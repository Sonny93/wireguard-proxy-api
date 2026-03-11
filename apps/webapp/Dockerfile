# https://hub.docker.com/_/node/tags
# Source : https://github.com/adonisjs-community/adonis-packages/blob/main/Dockerfile

FROM node:24.14-alpine3.22 AS base

RUN apk --no-cache add curl g++ make python3 && corepack enable

# All deps stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --ignore-scripts --frozen-lockfile
RUN pnpm rebuild better-sqlite3

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
RUN echo 'public-hoist-pattern[]=*' > .npmrc
RUN pnpm install --ignore-scripts --prod --frozen-lockfile
RUN pnpm rebuild better-sqlite3

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/package.json /app/package.json
COPY --from=deps /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY . .
RUN pnpm run build:core
WORKDIR /app/apps/webapp
RUN node ace build --ignore-ts-errors

# Production stage
FROM base

ENV NODE_ENV=production
ENV LOG_LEVEL=debug
ENV CACHE_VIEWS=false
ENV SESSION_DRIVER=cookie
ENV PORT=3333

WORKDIR /app
RUN mkdir -p /app/tmp
COPY --from=build /app/apps/webapp/build /app
COPY --from=build /app/apps/webapp/scripts/entrypoint.sh /app/scripts/entrypoint.sh
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/packages /app/packages
RUN chmod +x /app/scripts/entrypoint.sh
RUN npm rebuild better-sqlite3

EXPOSE 3333

CMD ["/app/scripts/entrypoint.sh"]
