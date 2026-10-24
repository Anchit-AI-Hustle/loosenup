#!/usr/bin/env bash
# Installs the native LoosenUp iPhone app when someone taps "Install the native app" on /get.
#
# A free Apple ID build can only be installed from a Mac, so /get queues a request on the server
# (api/iphone.js) and this job, run every minute by launchd (scripts/com.loosenup.iphone-agent.plist),
# picks it up, installs the latest signed build on the iPhone over Wi-Fi and reports back.
#
# The private key lives in ~/.config/loosenup/iphone-install-key (set up by scripts/iphone-agent-setup.sh).
set -uo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

API="https://loosenup.anchit-tandon.com/api/iphone"
KEYFILE="$HOME/.config/loosenup/iphone-install-key"
IPA="downloads/loosenup-ios.ipa"
[ -r "$KEYFILE" ] || exit 0
KEY="$(cat "$KEYFILE")"

say() { echo "$(date '+%Y-%m-%d %H:%M') $*"; }
call() { curl -fsS --max-time 20 -X POST "$API" -H 'Content-Type: application/json' --data "$1"; }
field() { python3 -c "import json,sys; print(json.load(sys.stdin).get('$1', ''))"; }

NEXT="$(call "{\"action\":\"next\",\"key\":\"$KEY\"}")" || exit 0
ID="$(printf '%s' "$NEXT" | field id)"
[ -n "$ID" ] || exit 0
say "Install requested from /get (request $ID)."

# Days left on the signing of the local build (0 when it cannot be read).
days_left() {
  local d; d="$(mktemp -d)"
  unzip -q "$IPA" 'Payload/*/embedded.mobileprovision' -d "$d" 2>/dev/null || { echo 0; rm -rf "$d"; return; }
  local end; end="$(security cms -D -i "$d"/Payload/*/embedded.mobileprovision 2>/dev/null | plutil -extract ExpirationDate raw -o - - 2>/dev/null)"
  rm -rf "$d"
  [ -n "$end" ] || { echo 0; return; }
  echo $(( ($(date -j -u -f '%Y-%m-%dT%H:%M:%SZ' "$end" +%s) - $(date +%s)) / 86400 ))
}

OK=false
MSG=""
if [ ! -f "$IPA" ] || [ "$(days_left)" -lt 1 ]; then
  # Re-sign first; renew-iphone.sh also installs the fresh build.
  if FORCE=1 bash scripts/renew-iphone.sh >>"$HOME/Library/Logs/loosenup-renew-iphone.log" 2>&1 && [ ! -f downloads/.iphone-install-pending ]; then OK=true
  else MSG="the iPhone was not reachable. Keep it unlocked and on the same Wi-Fi as the Mac"; fi
elif OUT="$(bash scripts/install-iphone.sh "$IPA" 2>&1)"; then OK=true
else MSG="$(printf '%s' "$OUT" | grep -m1 -E 'No iPhone found|error|Error' | tr -d '"\\' | cut -c1-200)"; MSG="${MSG:-the iPhone was not reachable}"; fi

call "{\"action\":\"finish\",\"key\":\"$KEY\",\"id\":$ID,\"ok\":$OK,\"message\":\"$MSG\"}" >/dev/null || true
say "Request $ID: $([ "$OK" = true ] && echo installed || echo "not installed ($MSG)")."
