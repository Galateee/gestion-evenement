#!/bin/bash
set -e

echo "Starting User Service..."

echo "Waiting for database to be ready..."
./scripts/wait-for.sh $DATABASE_HOST:$DATABASE_PORT --timeout=60 --strict -- echo "Database is ready!"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Starting the application..."
exec "$@"