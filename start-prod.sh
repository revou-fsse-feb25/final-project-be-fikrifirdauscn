#!/usr/bin/env bash
set -euo pipefail

echo "[start-prod] Prisma generate..."
npx prisma generate

echo "[start-prod] Waiting for database to be reachable..."
DB_HOST=$(node -e "try{console.log(new URL(process.env.DATABASE_URL).hostname)}catch(e){process.exit(1)}")
DB_PORT=$(node -e "try{console.log(new URL(process.env.DATABASE_URL).port||'5432')}catch(e){process.exit(1)}")

ATTEMPTS=30; SLEEP=2; i=1
until node -e "const n=require('net');const s=n.createConnection({host:'$DB_HOST',port:parseInt('$DB_PORT')},()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1));"; do
  if [ $i -ge $ATTEMPTS ]; then
    echo "[start-prod] DB still unreachable after $ATTEMPTS attempts. Failing..."
    exit 1
  fi
  echo "[start-prod] DB not ready ($i/$ATTEMPTS). Retrying in ${SLEEP}s..."
  i=$((i+1)); sleep $SLEEP
done

echo "[start-prod] Prisma migrate deploy..."
npx prisma migrate deploy

echo "[start-prod] Start app..."
node dist/src/main.js
