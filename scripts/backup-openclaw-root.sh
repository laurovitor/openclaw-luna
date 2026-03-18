#!/usr/bin/env bash
set -euo pipefail

REPO="/home/laurovitor/.openclaw"
LOG_DIR="/home/laurovitor/.openclaw/logs"
mkdir -p "$LOG_DIR"

cd "$REPO"
export PATH="/home/laurovitor/.local/bin:/home/laurovitor/.nvm/versions/node/v24.14.0/bin:/home/linuxbrew/.linuxbrew/bin:/usr/local/bin:/usr/bin:/bin"

git add -A
if git diff --cached --quiet; then
  echo "[$(date --iso-8601=seconds)] no changes to back up"
  exit 0
fi

STAMP="$(date '+%Y-%m-%d %H:%M:%S %z')"
git commit -m "chore: daily backup ${STAMP}"
git branch -M main
git push origin main

echo "[$(date --iso-8601=seconds)] backup pushed"
