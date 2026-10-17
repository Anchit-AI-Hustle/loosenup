#!/usr/bin/env bash
# Build the named LightenUp deliverables into dist/.
set -euo pipefail
cd "$(dirname "$0")/.."
V=$(node -p "require('./package.json').version")
mkdir -p dist
rm -f dist/lightenup-*
(cd www && zip -qr "../dist/lightenup-pwa-v$V.zip" .)
cp android/app/build/outputs/apk/debug/app-debug.apk "dist/lightenup-android-debug-v$V.apk"
zip -qr "dist/lightenup-ios-xcode-project-v$V.zip" ios capacitor.config.json -x "ios/DerivedData/*" "ios/App/build/*" "*/xcuserdata/*"
git archive --format=zip -o "dist/lightenup-source-v$V.zip" HEAD
cp lightenup-live-qr.png "dist/lightenup-live-qr.png"
cp tests/test-log.txt "dist/lightenup-test-log-v$V.txt" 2>/dev/null || true
ls -la dist
