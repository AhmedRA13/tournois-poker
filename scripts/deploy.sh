#!/usr/bin/env bash
# Deploy update: pull → install → fetch → build
# Run on VPS as: bash scripts/deploy.sh
set -euo pipefail

SITE_DIR="/var/www/tournois-poker"
LOG_DIR="/var/log/tournois-poker"
NODE_BIN="$(command -v node)"

cd "$SITE_DIR"

echo "[1/3] Pulling latest code..."
git pull --ff-only

echo "[2/3] Installing dependencies..."
npm ci --prefer-offline 2>/dev/null || npm install

echo "[3/3] Fetching data + rebuilding..."
"$NODE_BIN" scripts/fetch_winamax.mjs >> "$LOG_DIR/fetch.log" 2>&1
npm run build >> "$LOG_DIR/build.log" 2>&1

echo "✅ Deploy complete — $(date)"
