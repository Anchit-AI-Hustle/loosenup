#!/usr/bin/env bash
# Run every acceptance suite and save a readable log to tests/test-log.txt.
set -uo pipefail
cd "$(dirname "$0")/.."
LIVE_URL="${LIVE_URL:-https://lightenup-app.vercel.app}"
LOG=tests/test-log.txt
{
  echo "LightenUp acceptance test log"
  echo "Run at: $(date -u '+%Y-%m-%d %H:%M UTC')   Node $(node -v)   Live URL: $LIVE_URL"
  echo
  echo "== Unit, flow, copy and safety tests (jsdom) =="
  node --test --test-concurrency=1 --test-reporter=spec tests/unit/ 2>&1
  echo
  echo "== Real browser tests (Playwright Chromium) =="
  node --test --test-concurrency=1 --test-reporter=spec tests/browser/ 2>&1
  echo
  echo "== Live deployment tests =="
  LIVE_URL="$LIVE_URL" node --test --test-concurrency=1 --test-reporter=spec tests/live/ 2>&1
} | grep -v "trust settings" | perl -pe 's/\e\[[0-9;]*m//g' > "$LOG"
grep -E "^ℹ (tests|pass|fail)" "$LOG"
