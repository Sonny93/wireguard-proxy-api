### Wireguard Proxy API

`wireguard-proxy-api` is a project that allows you to start and manage as many WireGuard proxies as there are configuration files in the `/storage/configs/*.conf` directory.

## WebApp

The frontend, accessible after authentication, allows you to:

- upload WireGuard configuration files
- start and stop WireGuard proxies
- view WireGuard proxy logs
- view WireGuard proxy stats

## API

There must be an API endpoint usable by shell scripts:

- `GET /api/proxies`: list available proxies

## Infra

The proxies must run in Docker containers.

#### Technologies

- **Backend**: AdonisJS 7 with Inertia 2
- **Frontend**: React 19
- **Styling**: Tailwind (using UnoCSS)
- **Database**: PostgreSQL 18
- **Infra**: Docker & Docker Compose
