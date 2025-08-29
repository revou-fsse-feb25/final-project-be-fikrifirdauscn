#!/usr/bin/env bash
set -euo pipefail

echo "[start-prod] Prisma generate..."
npx prisma generate

echo "[start-prod] Prisma migrate deploy..."
npx prisma migrate deploy

echo "[start-prod] Start app..."
node dist/src/main.js
