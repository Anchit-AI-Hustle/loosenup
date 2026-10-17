#!/usr/bin/env bash
# Build the named Sunpetal deliverables into dist/.
set -euo pipefail
cd "$(dirname "$0")/.."
V=$(node -p "require('./package.json').version")
mkdir -p dist
rm -f dist/sunpetal-*
(cd www && zip -qr "../dist/sunpetal-pwa-v$V.zip" .)
cp android/app/build/outputs/apk/debug/app-debug.apk "dist/sunpetal-android-debug-v$V.apk"
zip -qr "dist/sunpetal-ios-xcode-project-v$V.zip" ios capacitor.config.json -x "ios/DerivedData/*" "ios/App/build/*" "*/xcuserdata/*"
git archive --format=zip -o "dist/sunpetal-source-v$V.zip" HEAD
cp sunpetal-live-qr.png "dist/sunpetal-live-qr.png"
cp tests/test-log.txt "dist/sunpetal-test-log-v$V.txt" 2>/dev/null || true
ls -la dist
