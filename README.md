# Brightside

Two calm minutes, whenever you want them. Rate how calm you feel, take a 2-minute guided break, rate again, and see your **Calm gain**. A garden grows with every break.

> A wellbeing companion, not medical care.

- **Live app:** https://brightside-calm.vercel.app
- **QR code:** [brightside-live-qr.png](brightside-live-qr.png)
- **Android debug APK:** `android/app/build/outputs/apk/debug/app-debug.apk` (also exported as `dist/brightside-android-debug-v1.0.0.apk`)

## Install on your phone

- **Android (Chrome):** open the live URL, tap the Chrome menu, then **Install app**.
- **iPhone (Safari):** open the live URL, tap **Share**, then **Add to Home Screen**.

The app works offline after the first load.

## What is inside

| Area | Details |
| --- | --- |
| First open | Welcome (first name), welcome gift of 5 Seeds and 25 XP (Seedling bar starts at 50 percent), then straight into the first break. No paywall. |
| Break loop | Calm before (1 to 10) and a context chip, an auto-picked technique with the reason, the guided session (breathing orb or step counter, optional device voice, pause, finish early), calm after, then the result with the rising sun. |
| Techniques | Sigh of relief, Slow breeze, Here and now, Soft release (opens after 3 breaks), Let it out (opens after 5 breaks). Quick breeze is a 60s preset that is always free. |
| Recommender | Rule based by context on day one. After 2 or more breaks with a technique in a context, the technique with the best average Calm gain for that context is preferred. Techniques that are not open yet are never picked. |
| Gamification | Sunny days (once per calendar day), one Rain day per week bridges a single quiet day, milestones at 3, 7, 21 and 30 days, a daily 25 percent Sunbeam surprise, XP = 10 + 2 x positive Calm gain, levels Seedling, Sprout, Bud, Bloom, Full Bloom, Meadow, badges, a garden that only grows. |
| Fair rewards | At most 2 free Seeds per week from all rewards combined (milestones, Sunbeam surprise, sharing, "You showed up"). At most 2 nudges per day. |
| Money | Seeds (credits) and Full Bloom (subscription). Checkout is a clearly labelled **DEMO**: nothing is charged and no payment details are asked for. At 0 Seeds on the free plan, a guided break opens the Seed shop. Quick breeze never uses a Seed. |
| Safety | Let it out checks typed text for crisis phrases and opens a support sheet: India Tele-MANAS 14416, findahelpline.com, emergency 112. Journal text is never stored anywhere. Support lines are always available from Me. |
| Privacy | All data stays on the device in localStorage (`brightside.v1`). No accounts, no analytics, fonts are self-hosted. |
| Golden hour | A daily time you choose. On the web it shows a gentle in-app note. On the Android and iOS apps it schedules one real local notification per day. |

### Prices (placeholders)

| Item | INR | USD |
| --- | --- | --- |
| Full Bloom | ₹299 / month | USD 6.99 / month |
| 10 Seeds | ₹99 | USD 1.99 |
| 30 Seeds | ₹249 | USD 4.99 |
| 100 Seeds | ₹699 | USD 12.99 |

Exchange rate check on 17 Oct 2026 (open.er-api.com, updated 00:02 UTC): **USD 1 = ₹95.11**. At that rate USD 6.99 is about ₹665, so the INR prices sit at roughly 45 percent of the USD prices. That is a deliberate purchasing power discount for India, in line with common app store regional pricing. Revisit before going live.

## Project layout

```
www/            the web app (PWA). Also the Capacitor webDir.
  index.html    screens, sheets and tab bar
  styles.css    morning sky theme, safe areas, reduced motion
  app.js        engine (Seeds, XP, Sunny days, recommender) and UI
  sw.js         precaches the shell, cache-first for same-origin GET
  manifest.json standalone, id "/", 192, 512 and maskable icons
tests/          acceptance tests AT1 to AT13 (jsdom + Playwright)
scripts/        icon and QR generators (Python Pillow and qrcode)
android/ ios/   Capacitor native projects (appId com.brightside.calm)
vercel.json     static hosting from www/ with sw.js no-cache and the manifest content type
```

## Develop and test

```bash
npm install
npm run serve            # http://127.0.0.1:4173
npm test                 # unit (jsdom) + browser (Playwright) suites
LIVE_URL=https://brightside-calm.vercel.app npm run test:live
```

The first browser run needs `npx playwright install chromium`. Screenshots from the browser suite land in `tests/screenshots/` at 390, 820 and 1440 px.

Regenerate icons and the QR code:

```bash
python3 -m venv .venv && .venv/bin/pip install pillow qrcode
.venv/bin/python scripts/make_icons.py --native
.venv/bin/python scripts/make_qr.py https://brightside-calm.vercel.app
```

## Native apps (Capacitor 8)

### Android

```bash
npx cap sync android
cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./gradlew assembleDebug
```

The APK is at `android/app/build/outputs/apk/debug/app-debug.apk`. Install it with `adb install -r` or copy it to the phone and open it (allow installs from that source). A Play Store release needs a signed release build (`./gradlew bundleRelease` with your own upload keystore) and a Google Play Console account.

### iOS

```bash
npx cap sync ios
npx cap open ios        # opens ios/App/App.xcodeproj in Xcode
```

The project builds for the iOS Simulator with no account. Installing on a real iPhone needs an Apple Developer Program membership (USD 99 per year): set your Team under Signing and Capabilities, then archive and upload to App Store Connect for TestFlight. A free Apple ID can also run it on your own iPhone for 7 days through Xcode.

### Golden hour reminders

`@capacitor/local-notifications` schedules a single repeating notification (id 1) at the chosen time, so there is never more than one reminder a day. Android 13 and newer ask for notification permission the first time you save a Golden hour.

## Deploy

Vercel serves `www/` as static files (no build step). `vercel.json` sets `Cache-Control: no-cache` on `sw.js` and `application/manifest+json` on `manifest.json`.
