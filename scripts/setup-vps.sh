#!/usr/bin/env bash
# One-time VPS setup for tournois-poker.fr
# Run as: bash scripts/setup-vps.sh
set -euo pipefail

REPO_URL="https://github.com/AhmedRA13/tournois-poker.git"
SITE_DIR="/var/www/tournois-poker"
NGINX_CONF="/etc/nginx/sites-available/tournois-poker.fr"
LOG_DIR="/var/log/tournois-poker"
DOMAIN="tournois-poker.fr"
NODE_BIN="$(command -v node)"

echo "=== tournois-poker.fr VPS setup ==="

# ── Clone or pull repo ────────────────────────────────────────────────────
if [ -d "$SITE_DIR/.git" ]; then
  echo "[1/8] Updating existing repo..."
  cd "$SITE_DIR" && git pull --ff-only
else
  echo "[1/8] Cloning repo..."
  sudo mkdir -p "$SITE_DIR"
  sudo chown ubuntu:ubuntu "$SITE_DIR"
  git clone "$REPO_URL" "$SITE_DIR"
  cd "$SITE_DIR"
fi

# ── Install dependencies ──────────────────────────────────────────────────
echo "[2/8] Installing npm dependencies..."
cd "$SITE_DIR"
npm ci --prefer-offline 2>/dev/null || npm install

# ── Create data directories ───────────────────────────────────────────────
echo "[3/8] Creating data directories..."
mkdir -p "$SITE_DIR/data/news"
mkdir -p "$LOG_DIR"

# ── Initial data fetch ────────────────────────────────────────────────────
echo "[4/8] Fetching initial tournament data..."
cd "$SITE_DIR"
"$NODE_BIN" scripts/fetch_winamax.mjs 2>&1 | tee "$LOG_DIR/fetch-init.log"

# ── Build ─────────────────────────────────────────────────────────────────
echo "[5/8] Building static site..."
cd "$SITE_DIR"
npm run build 2>&1 | tee "$LOG_DIR/build-init.log"

# ── Nginx config ──────────────────────────────────────────────────────────
echo "[6/8] Configuring nginx..."
sudo cp "$SITE_DIR/nginx/tournois-poker.fr.conf" "$NGINX_CONF"
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/tournois-poker.fr
sudo nginx -t
sudo systemctl reload nginx
echo "    Nginx reloaded."

# ── Certbot HTTPS ─────────────────────────────────────────────────────────
echo "[7/8] Setting up HTTPS (certbot)..."
if ! sudo certbot certificates 2>/dev/null | grep -q "$DOMAIN"; then
  sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
    --non-interactive --agree-tos --email admin@tournois-poker.fr \
    --redirect
  echo "    SSL certificate issued."
else
  echo "    Certificate already exists, skipping."
fi

# ── Cron ──────────────────────────────────────────────────────────────────
echo "[8/8] Installing cron job..."
CRON_LINE="0 2 * * * cd $SITE_DIR && $NODE_BIN scripts/fetch_winamax.mjs >> $LOG_DIR/fetch.log 2>&1 && npm run build >> $LOG_DIR/build.log 2>&1"

# Remove old cron entries for this site
(crontab -l 2>/dev/null | grep -v "tournois-poker" ; echo "$CRON_LINE") | crontab -
echo "    Cron installed: daily at 02:00 UTC"

echo ""
echo "✅ Setup complete!"
echo "   Site: https://$DOMAIN"
echo "   Root: $SITE_DIR/out"
echo "   Logs: $LOG_DIR"
echo ""
echo "⚠️  If certbot failed, ensure DNS A records point to this server:"
echo "   tournois-poker.fr     → $(curl -s ifconfig.me)"
echo "   www.tournois-poker.fr → $(curl -s ifconfig.me)"
