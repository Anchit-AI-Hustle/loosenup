#!/usr/bin/env bash
# Keeps the LoosenUp iPhone app working on Anchit's own iPhone on the free Apple ID.
#
# A free Apple ID signs apps for 7 days. This rebuilds and re-signs the app when 3 days or less
# are left, installs it on the iPhone (cable, or the same Wi-Fi after pairing once), and puts the
# fresh file on https://loosenup.anchit-tandon.com/get so it can also be reinstalled from Safari.
#
#   bash scripts/renew-iphone.sh          # renews only when needed
#   FORCE=1 bash scripts/renew-iphone.sh  # renews now
#
# A daily launchd job runs it (scripts/com.loosenup.renew-iphone.plist). Log: ~/Library/Logs/loosenup-renew-iphone.log
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

BUNDLE_ID="com.loosenup.calm"
TEAM="6D7XLS9CRH"
IPA="downloads/loosenup-ios.ipa"
SITE="https://loosenup.anchit-tandon.com"
PROFILES="$HOME/Library/Developer/Xcode/UserData/Provisioning Profiles"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

say() { echo "$(date '+%Y-%m-%d %H:%M') $*"; }
note() { osascript -e "display notification \"$1\" with title \"LoosenUp iPhone app\"" >/dev/null 2>&1 || true; }

# Days left on the profile inside an app file (0 when it cannot be read).
days_left() {
  local d="$WORK/check"; rm -rf "$d"; mkdir -p "$d"
  unzip -q "$1" 'Payload/*/embedded.mobileprovision' -d "$d" 2>/dev/null || { echo 0; return; }
  security cms -D -i "$d"/Payload/*/embedded.mobileprovision >"$d/p.plist" 2>/dev/null || { echo 0; return; }
  local end; end="$(plutil -extract ExpirationDate raw -o - "$d/p.plist" 2>/dev/null)" || { echo 0; return; }
  echo $(( ($(date -j -u -f '%Y-%m-%dT%H:%M:%SZ' "$end" +%s) - $(date +%s)) / 86400 ))
}

if [ -z "${FORCE:-}" ] && [ -f "$IPA" ]; then
  LEFT="$(days_left "$IPA")"
  if [ "$LEFT" -gt 3 ]; then say "The iPhone app is signed for $LEFT more days. Nothing to do."; exit 0; fi
  say "The iPhone app has $LEFT days left. Renewing."
fi

# Xcode reuses a profile while it is still valid, so set this app's profiles aside to get a fresh 7 days.
mkdir -p "$PROFILES.loosenup-old"
for p in "$PROFILES"/*.mobileprovision; do
  [ -f "$p" ] || continue
  if security cms -D -i "$p" 2>/dev/null | grep -q "$TEAM.$BUNDLE_ID"; then mv "$p" "$PROFILES.loosenup-old/"; fi
done

say "Copying the current app into the iPhone project ..."
npx cap copy ios >/dev/null

say "Building and signing ..."
xcodebuild archive -project ios/App/App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$WORK/App.xcarchive" \
  -allowProvisioningUpdates DEVELOPMENT_TEAM="$TEAM" CODE_SIGN_STYLE=Automatic -quiet
xcodebuild -exportArchive -archivePath "$WORK/App.xcarchive" -exportPath "$WORK/export" \
  -exportOptionsPlist scripts/ios-export.plist -allowProvisioningUpdates -quiet
NEW="$(find "$WORK/export" -name '*.ipa' | head -1)"
[ -n "$NEW" ] || { say "The build made no app file."; note "Renewal did not finish. See the log."; exit 1; }
LEFT="$(days_left "$NEW")"
[ "$LEFT" -ge 5 ] || { say "The new build is only signed for $LEFT days, so it was not used."; note "Renewal did not finish. See the log."; exit 1; }
cp "$NEW" "$IPA"
say "Signed for $LEFT days."

PHONE="no"
if bash scripts/install-iphone.sh "$IPA"; then PHONE="yes"; fi

# Only put it online when the committed site is what is already live, so this never ships unreleased work.
if [ "$(git show HEAD:www/app.js | shasum | cut -c1-40)" = "$(curl -fsS "$SITE/app.js" | shasum | cut -c1-40)" ]; then
  bash scripts/deploy.sh
  for wait in 10 20 30 60; do
    if [ "$(shasum "$IPA" | cut -c1-40)" = "$(curl -fsS "$SITE/download/loosenup-ios.ipa" | shasum | cut -c1-40)" ]; then say "The fresh app is on $SITE/get."; break; fi
    sleep "$wait"
  done
else
  say "The committed app differs from the live site, so the website was left alone. Deploy when ready: bash scripts/deploy.sh"
fi

if [ "$PHONE" = "yes" ]; then
  note "Renewed for $LEFT days and updated on your iPhone."
else
  note "Renewed for $LEFT days. Open loosenup.anchit-tandon.com/get in Safari on your iPhone to reinstall."
fi
say "Done."
