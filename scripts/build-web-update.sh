#!/usr/bin/env bash
# Package www/ as a live-update bundle for the iPhone and Android apps.
# Writes downloads/updates/loosenup-web-<version>.zip and latest.json (with a SHA-256 checksum).
set -euo pipefail
cd "$(dirname "$0")/.."
V=$(node -p "require('./package.json').version")
APPV=$(grep -oE "var VERSION = '[0-9.]+'" www/app.js | grep -oE "[0-9.]+")
[ "$V" = "$APPV" ] || { echo "package.json $V and app.js $APPV differ"; exit 1; }
mkdir -p downloads/updates
rm -f downloads/updates/*.zip
ZIP="downloads/updates/loosenup-web-$V.zip"
(cd www && zip -qr -X "../$ZIP" . -x '.DS_Store' '*/.DS_Store')
SUM=$(shasum -a 256 "$ZIP" | cut -d' ' -f1)
cat > downloads/updates/latest.json <<JSON
{
  "version": "$V",
  "url": "https://loosenup.anchit-tandon.com/updates/loosenup-web-$V.zip",
  "checksum": "$SUM"
}
JSON
echo "update bundle $V ($(du -h "$ZIP" | cut -f1)) sha256 ${SUM:0:12}"
