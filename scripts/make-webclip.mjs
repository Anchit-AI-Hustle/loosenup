// Builds www/loosenup.mobileconfig: an iOS configuration profile holding one Web Clip.
// Tapping Install on iPhone on /get in Safari, then Settings, Profile Downloaded, Install, puts a
// full-screen LoosenUp icon on the home screen, with no App Store, no Mac and no developer account
// (the same way The Third Eye installs on iPhone). The UUIDs are fixed, so installing again replaces
// the same profile instead of adding a second icon. Run after changing the app icon:
//   node scripts/make-webclip.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://loosenup.anchit-tandon.com';
const PROFILE_UUID = 'CD3F0B59-B307-4A16-84EE-381B9DFA2879';
const CLIP_UUID = '89A97C47-5C8C-40D5-9276-5D77D7569121';

export function webClipProfile(iconBase64) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>PayloadContent</key><array><dict>
<key>PayloadType</key><string>com.apple.webClip.managed</string>
<key>PayloadVersion</key><integer>1</integer>
<key>PayloadIdentifier</key><string>com.loosenup.calm.webclip</string>
<key>PayloadUUID</key><string>${CLIP_UUID}</string>
<key>PayloadDisplayName</key><string>LoosenUp</string>
<key>URL</key><string>${ORIGIN}/?app=webclip</string>
<key>Label</key><string>LoosenUp</string>
<key>Icon</key><data>${iconBase64}</data>
<key>FullScreen</key><true/>
<key>IsRemovable</key><true/>
<key>Precomposed</key><true/>
</dict></array>
<key>PayloadType</key><string>Configuration</string>
<key>PayloadVersion</key><integer>1</integer>
<key>PayloadIdentifier</key><string>com.loosenup.calm</string>
<key>PayloadUUID</key><string>${PROFILE_UUID}</string>
<key>PayloadDisplayName</key><string>LoosenUp app</string>
<key>PayloadDescription</key><string>Adds LoosenUp to your home screen as a full-screen app.</string>
<key>PayloadOrganization</key><string>LoosenUp</string>
<key>PayloadRemovalDisallowed</key><false/>
</dict></plist>
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const icon = readFileSync(path.join(ROOT, 'www/icons/icon-512.png')).toString('base64');
  writeFileSync(path.join(ROOT, 'www/loosenup.mobileconfig'), webClipProfile(icon));
  console.log('Wrote www/loosenup.mobileconfig');
}
