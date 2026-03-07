FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        wireguard-tools \
        iproute2 \
        iptables \
        procps \
        tinyproxy \
        ca-certificates \
        tini \
        bash \
    && rm -rf /var/lib/apt/lists/*

ENV WG_CONFIG=/vpn/wg0.conf \
    PROXY_PORT=3128

RUN mkdir -p /vpn /etc/wireguard

COPY scripts/entrypoint.sh /entrypoint.sh
COPY scripts/resolvconf-noop /usr/local/bin/resolvconf
COPY scripts/sysctl-wrapper /usr/local/sbin/sysctl

RUN chmod +x /entrypoint.sh /usr/local/bin/resolvconf /usr/local/sbin/sysctl

EXPOSE 3128

ENTRYPOINT ["/usr/bin/tini", "--", "/entrypoint.sh"]

