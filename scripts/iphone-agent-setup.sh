#!/usr/bin/env bash
# One-time setup for "Install the native app" on /get:
#   1. makes a private key, saved in Vercel (IPHONE_INSTALL_KEY) and in ~/.config/loosenup (never printed),
#   2. switches on the Mac job that installs on request (scripts/com.loosenup.iphone-agent.plist),
#   3. opens the private link on the connected iPhone, so its /get shows the button.
# Redeploy after the first run so the server reads the new key: bash scripts/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."
KEYFILE="$HOME/.config/loosenup/iphone-install-key"
mkdir -p "$(dirname "$KEYFILE")"
if [ ! -s "$KEYFILE" ]; then
  (umask 077; openssl rand -hex 24 > "$KEYFILE")
  npx --yes vercel env rm IPHONE_INSTALL_KEY production -y >/dev/null 2>&1 || true
  tr -d '\n' < "$KEYFILE" | npx --yes vercel env add IPHONE_INSTALL_KEY production >/dev/null
  echo "Saved the private key in Vercel and in $KEYFILE."
fi
chmod 600 "$KEYFILE"

PLIST="$HOME/Library/LaunchAgents/com.loosenup.iphone-agent.plist"
cp scripts/com.loosenup.iphone-agent.plist "$PLIST"
launchctl bootout "gui/$(id -u)/com.loosenup.iphone-agent" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "The Mac job is on: it checks every minute."

if [ "${OPEN_ON_PHONE:-1}" = 1 ]; then
  DEVICE="${DEVICE:-$(xcrun devicectl list devices 2>/dev/null | awk '/physical/ && /available/ {for (i=1;i<=NF;i++) if ($i ~ /^[0-9A-F]{8}-[0-9A-F]{16}$/) {print $i; exit}}')}"
  if [ -n "$DEVICE" ] && xcrun devicectl device process launch --device "$DEVICE" \
      --payload-url "https://loosenup.anchit-tandon.com/get#iphone=$(cat "$KEYFILE")" com.apple.mobilesafari >/dev/null 2>&1; then
    echo "Opened /get with the private link on your iPhone. It remembers it from now on."
  else
    echo "Could not reach the iPhone. Plug it in or join the same Wi-Fi, then run this again."
  fi
fi
