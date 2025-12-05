#!/usr/bin/env bash
# Usage: wait-for.sh host:port [timeout_seconds]
HOSTPORT=$1
TIMEOUT=${2:-30}
IFS=':' read -r HOST PORT <<< "$HOSTPORT"

n=0
until nc -z "$HOST" "$PORT" >/dev/null 2>&1; do
  n=$((n+1))
  if [ $n -ge $TIMEOUT ]; then
    echo "Timeout waiting for $HOSTPORT"
    exit 1
  fi
  sleep 1
done

exit 0