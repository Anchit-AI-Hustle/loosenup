#!/usr/bin/env bash
# Re-apply LoosenUp's native customisations after `npx cap add android` / `npx cap add ios`.
set -euo pipefail
cd "$(dirname "$0")/.."

RES=android/app/src/main/res
if [ -d "$RES" ]; then
  # Android 13+ notification permission for Golden hour reminders.
  MANIFEST=android/app/src/main/AndroidManifest.xml
  grep -q POST_NOTIFICATIONS "$MANIFEST" || perl -0pi -e 's|(<uses-permission android:name="android.permission.INTERNET" />)|$1\n    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />|' "$MANIFEST"
  # Small white sun used in the status bar for the Golden hour notification.
  cat > "$RES/drawable/ic_stat_loosenup.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<!-- LoosenUp notification icon: a small petal sun -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#FFFFFFFF" android:pathData="M12,7.5a4.5,4.5 0,1 1,0 9a4.5,4.5 0,1 1,0 -9z"/>
    <path android:fillColor="#FFFFFFFF" android:pathData="M12,1.5c1.6,1 1.6,3.2 0,4.4c-1.6,-1.2 -1.6,-3.4 0,-4.4zM12,22.5c-1.6,-1 -1.6,-3.2 0,-4.4c1.6,1.2 1.6,3.4 0,4.4zM1.5,12c1,-1.6 3.2,-1.6 4.4,0c-1.2,1.6 -3.4,1.6 -4.4,0zM22.5,12c-1,1.6 -3.2,1.6 -4.4,0c1.2,-1.6 3.4,-1.6 4.4,0zM4.6,4.6c1.8,-0.4 3.4,1.2 3,3c-1.8,0.4 -3.4,-1.2 -3,-3zM19.4,19.4c-1.8,0.4 -3.4,-1.2 -3,-3c1.8,-0.4 3.4,1.2 3,3zM4.6,19.4c-0.4,-1.8 1.2,-3.4 3,-3c0.4,1.8 -1.2,3.4 -3,3zM19.4,4.6c0.4,1.8 -1.2,3.4 -3,3c-0.4,-1.8 1.2,-3.4 3,-3z"/>
</vector>
XML
  [ -n "${ANDROID_HOME:-}" ] && echo "sdk.dir=$ANDROID_HOME" > android/local.properties
fi

PY=.venv/bin/python
[ -x "$PY" ] || PY=python3
"$PY" scripts/make_icons.py --native
echo "native setup done"
