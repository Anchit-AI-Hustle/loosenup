#!/usr/bin/env bash
# Installs the signed LoosenUp iPhone app on your connected iPhone, then opens it.
#
#   bash scripts/install-iphone.sh                 # installs downloads/loosenup-ios.ipa
#   bash scripts/install-iphone.sh path/to/App.ipa # or a specific build
#   DEVICE=<udid> bash scripts/install-iphone.sh   # pick a device when several are connected
#
# Needs: Xcode, and the iPhone plugged in (or on the same Wi-Fi after pairing once), unlocked,
# with Developer Mode on. The app is signed for the iPhones registered to team 6D7XLS9CRH.
set -euo pipefail
cd "$(dirname "$0")/.."

IPA="${1:-downloads/loosenup-ios.ipa}"
BUNDLE_ID="com.loosenup.calm"
[ -f "$IPA" ] || { echo "No app file at $IPA. Build one first (see README, Native apps)."; exit 1; }
command -v xcrun >/dev/null || { echo "Xcode is needed: install it from the App Store, then run xcode-select --install."; exit 1; }

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# Find a connected physical iPhone (not a simulator).
if [ -z "${DEVICE:-}" ]; then
  xcrun devicectl list devices --json-output "$WORK/devices.json" >/dev/null 2>&1 || true
  DEVICE="$(python3 - "$WORK/devices.json" <<'PY'
import json, sys
try:
    data = json.load(open(sys.argv[1]))
except Exception:
    sys.exit(0)
for d in data.get('result', {}).get('devices', []):
    hw = d.get('hardwareProperties', {})
    conn = d.get('connectionProperties', {})
    if hw.get('platform') == 'iOS' and hw.get('reality') == 'physical' and conn.get('tunnelState') != 'unavailable':
        print(hw.get('udid') or d.get('identifier')); break
PY
)"
fi
if [ -z "${DEVICE:-}" ]; then
  echo "No iPhone found. Plug it in with a cable, unlock it, tap Trust if asked, and run this again."
  exit 1
fi
echo "iPhone: $DEVICE"

# devicectl installs an .app bundle, so unpack the .ipa first.
unzip -q "$IPA" -d "$WORK/ipa"
APP="$(find "$WORK/ipa/Payload" -maxdepth 1 -name '*.app' | head -1)"
[ -n "$APP" ] || { echo "$IPA does not contain an app."; exit 1; }
VERSION="$(grep -o "VERSION = '[0-9.]*'" "$APP/public/app.js" | head -1 | cut -d"'" -f2 || true)"
echo "Installing LoosenUp ${VERSION:-} ..."
xcrun devicectl device install app --device "$DEVICE" "$APP"

echo "Opening LoosenUp ..."
if ! xcrun devicectl device process launch --device "$DEVICE" "$BUNDLE_ID" >/dev/null 2>&1; then
  echo "Installed. If it does not open, trust the developer once on the iPhone:"
  echo "Settings, General, VPN and Device Management, your Apple ID, Trust. Then open LoosenUp."
  exit 0
fi
echo "Done. LoosenUp ${VERSION:-} is open on your iPhone, and it will keep itself up to date."
