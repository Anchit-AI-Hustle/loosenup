#!/usr/bin/env bash
# Build the named LoosenUp deliverables into dist/.
set -euo pipefail
cd "$(dirname "$0")/.."
V=$(node -p "require('./package.json').version")
mkdir -p dist
rm -f dist/loosenup-*
(cd www && zip -qr "../dist/loosenup-pwa-v$V.zip" .)
cp android/app/build/outputs/apk/debug/app-debug.apk "dist/loosenup-android-debug-v$V.apk"
zip -qr "dist/loosenup-ios-xcode-project-v$V.zip" ios capacitor.config.json -x "ios/DerivedData/*" "ios/App/build/*" "*/xcuserdata/*"
git archive --format=zip -o "dist/loosenup-source-v$V.zip" HEAD
cp loosenup-live-qr.png "dist/loosenup-live-qr.png"
cp tests/test-log.txt "dist/loosenup-test-log-v$V.txt" 2>/dev/null || true
ls -la dist
