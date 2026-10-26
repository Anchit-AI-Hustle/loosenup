#!/usr/bin/env bash
# Keeps the LoosenUp iPhone app working on Anchit's own iPhone on the free Apple ID.
#
# A free Apple ID signs apps for 7 days, and Apple only lets a Mac install them (cable, or the same
# Wi-Fi after pairing once), never a web link. This rebuilds and re-signs the app when 3 days or less
# are left and installs it on the iPhone. If the iPhone is not reachable, the next run tries again.
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
PENDING="downloads/.iphone-install-pending"
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

# A build that could not reach the iPhone last time goes on as soon as the iPhone is around.
if [ -z "${FORCE:-}" ] && [ -f "$PENDING" ] && [ -f "$IPA" ] && [ "$(days_left "$IPA")" -gt 0 ]; then
  if bash scripts/install-iphone.sh "$IPA"; then rm -f "$PENDING"; note "Your iPhone has the renewed LoosenUp."; say "Installed the waiting build."; else say "The iPhone is still not reachable."; fi
fi

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
# A free Apple ID only keeps the phone on its device list while builds target it, and without it Xcode
# cannot make a new profile. A quick build aimed at the phone registers it again. Optional: the phone may be away.
PHONE="$(xcrun devicectl list devices 2>/dev/null | awk '/physical/ && !/unavailable/ { for (i = 1; i <= NF; i++) if ($i ~ /^[0-9A-F]+-[0-9A-F]+$/ && length($i) == 25) { print $i; exit } }')"
if [ -n "$PHONE" ]; then
  xcodebuild build -project ios/App/App.xcodeproj -scheme App -configuration Release -destination "id=$PHONE" \
    -derivedDataPath "$WORK/register" -allowProvisioningUpdates -allowProvisioningDeviceRegistration \
    DEVELOPMENT_TEAM="$TEAM" CODE_SIGN_STYLE=Automatic -quiet || say "Could not reach the phone for signing; trying the build anyway."
fi
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

if bash scripts/install-iphone.sh "$IPA"; then
  rm -f "$PENDING"
  note "Renewed for $LEFT days and updated on your iPhone."
else
  touch "$PENDING"
  note "Renewed for $LEFT days. Put your iPhone on the same Wi-Fi as this Mac, unlocked, and it updates on the next check."
fi
say "Done."
