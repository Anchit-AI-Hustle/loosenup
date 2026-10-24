#!/usr/bin/env bash
# Deploys the committed site (HEAD) to Vercel production: https://loosenup.anchit-tandon.com
#
#   bash scripts/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

[ -d .vercel ] || { echo "This folder is not linked to Vercel. Run: npx vercel link"; exit 1; }

SNAP="$(mktemp -d)"
trap 'rm -rf "$SNAP"' EXIT
git archive HEAD | tar -x -C "$SNAP"
cp -R .vercel "$SNAP/.vercel"

echo "Deploying $(git rev-parse --short HEAD) ..."
for try in 1 2 3 4 5; do
  if (cd "$SNAP" && npx --yes vercel deploy --prod --yes >"$SNAP/.deploy.log" 2>&1); then
    echo "Live: $(grep -Eo 'https://[^ ]+\.vercel\.app' "$SNAP/.deploy.log" | tail -1)"
    exit 0
  fi
  echo "Deploy attempt $try did not finish; trying again."
  sleep $((try * 10))
done
tail -20 "$SNAP/.deploy.log"
exit 1
