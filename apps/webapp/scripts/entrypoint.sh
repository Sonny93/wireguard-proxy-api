#!/bin/sh
set -e
export NODE_ENV=production
node bin/console.js migration:run --force
node bin/console.js db:seed
exec node bin/server.js
