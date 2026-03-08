#!/usr/bin/env bash
set -euo pipefail

WG_CONFIG="${WG_CONFIG:-/vpn/wg0.conf}"
PROXY_PORT="${PROXY_PORT:-3128}"

if [ ! -f "$WG_CONFIG" ]; then
  echo "WireGuard config not found at $WG_CONFIG" >&2
  exit 1
fi

cp "$WG_CONFIG" /etc/wireguard/wg0.conf
chmod 600 /etc/wireguard/wg0.conf

trap 'wg-quick down wg0 >/dev/null 2>&1 || true' EXIT INT TERM

wg-quick up wg0

DNS_LINE="$(grep -i '^DNS' "$WG_CONFIG" | head -n1 || true)"
if [ -n "$DNS_LINE" ]; then
  DNS_SERVERS="$(echo "$DNS_LINE" | cut -d= -f2- | tr ',' ' ')"
  : > /etc/resolv.conf
  for server in $DNS_SERVERS; do
    echo "nameserver $server" >> /etc/resolv.conf
  done
fi

iptables -t nat -C POSTROUTING -o wg0 -j MASQUERADE 2>/dev/null || iptables -t nat -A POSTROUTING -o wg0 -j MASQUERADE
iptables -C FORWARD -i wg0 -o wg0 -j ACCEPT 2>/dev/null || iptables -A FORWARD -i wg0 -o wg0 -j ACCEPT

exec node /app/dist/proxy.js

