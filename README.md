# LoosenUp

**Two calm minutes to loosen up and feel lighter.** LoosenUp's goal is simple: help people ease a tense day and soften a heavy, low mood, and make sure help is one tap away on the hardest days.

Rate how calm you feel, take a 2-minute guided break chosen for what you are carrying (work, relationships, low days, sleep), rate again, and see your **Calm gain**. A daily mood check-in, Small steps, Kind words and a Good things jar support low days. **SOS** sits in the header of every screen.

The brand mark is a petal sun that opens on every in-breath, unfurls on the result screen and sits in the app icon.

> A wellbeing companion, not medical care.

- **Live app:** https://loosenup.vercel.app
- **QR code:** [loosenup-live-qr.png](loosenup-live-qr.png)
- **Android APK:** `downloads/loosenup-android.apk` (served at `/download/loosenup-android.apk`; also `dist/loosenup-android-debug-v1.3.1.apk`)
- **Repository:** https://github.com/Anchit-AI-Hustle/loosenup (private)

## Install on your phone

Open **https://loosenup.vercel.app/install.html** on the phone, or scan `loosenup-install-qr.png`.

- **Android (direct install):** tap **Download for Android**, open the downloaded `LoosenUp.apk`, allow your browser to install apps if asked (Settings, then Install unknown apps), then tap Install. Direct link: https://loosenup.vercel.app/download/loosenup-android.apk
- **Android (web app):** open the live URL in Chrome, open the menu, then **Install app**.
- **iPhone:** open the live URL in Safari, tap **Share**, then **Add to Home Screen**. A native iPhone install needs TestFlight, which needs an Apple Developer account (see Native apps below).

The app works offline after the first load.

## What is inside

| Area | Details |
| --- | --- |
| SOS | An SOS button on every screen, even before onboarding. It opens Tele-MANAS 14416 (India, free, 24x7), emergency 112, findahelpline.com, a free 60 second breather and **Message my trusted person**: a pre-written text to someone you chose (saved on the device only), with your location added only if you switch that on. The phone's messaging app opens with the text ready; you tap Send. With no server, the app cannot send messages silently. |
| Detecting hard moments | Crisis phrases (for example suicide, kill myself, end it all, self harm, want to die) are checked in every text box: Let it out and the Good things jar. A match opens SOS straight away and the text is not saved. Choosing the lowest mood asks one direct, gentle question: "Are you having thoughts of ending your life or hurting yourself?" Yes opens SOS. Three heavy check-ins in a row bring up a "you do not have to carry it alone" card. |
| Spaces | **Work:** Work pile-up, Before a meeting, After a tough call, Hard to switch off, with Desk reset and Steady square (box breathing). **Relationships:** Tense with someone, After a disagreement, Before a hard talk, Feeling disconnected, with Pause before replying, Cool down (long breath out) and Warm wishes. **Low days:** Feeling low, Low energy, Hard on myself, with Kind words (self-compassion). **Sleep:** Winding down, Mind racing at night. |
| Lifting low days | **Mood check-in** once a day (Very heavy to Bright, +2 XP) with a mood line and trend insight on the Sunny week. **Small steps:** one tiny doable action at a time, based on behavioural activation (daylight, water, a hello to someone you trust); each plants a sprout in the garden (+3 XP, up to 3 a day). **Good things jar:** saved only when you tap Save; on heavy days a saved good thing resurfaces. |
| First open | Welcome (first name), welcome gift of 5 Seeds and 25 XP (Seedling bar starts at 50 percent), then straight into the first break. No paywall. |
| Break loop | Calm before (1 to 10) and a context chip, an auto-picked technique with the reason, the guided session (breathing orb or step counter, optional device voice, pause, finish early), calm after, then the result with the rising sun. |
| Techniques | Everyday: Sigh of relief, Slow breeze, Here and now, Soft release (opens after 3 breaks), Let it out (opens after 5 breaks). Work: Desk reset, Steady square. Relationships: Pause before replying, Cool down, Warm wishes. Low days: Kind words. Quick breeze is a 60s preset that is always free. |
| Recommender | Rule based by context on day one. After 2 or more breaks with a technique in a context, the technique with the best average Calm gain for that context is preferred. Techniques that are not open yet are never picked. |
| Gamification | Sunny days (once per calendar day), one Rain day per week bridges a single quiet day, milestones at 3, 7, 21 and 30 days, a daily 25 percent Sunbeam surprise, XP = 10 + 2 x positive Calm gain, levels Seedling, Sprout, Bud, Bloom, Full Bloom, Meadow, badges, a garden that only grows. |
| Play | Three calm mini-games where every round ends kindly and nothing costs Seeds. **Petal Pairs** (memory match, 6 flower pairs), **Sunbeam Catch** (45 seconds of tapping drifting sunbeams into a jar, nothing is ever dropped), **Breath Bloom** (hold to breathe in with a growing ring, let go to breathe out, six breaths bloom six flowers). Each finished game gives 5 XP, up to 3 games a day, plus a Playful badge. Games never give free Seeds, so paid Seeds stay protected. |
| Design | Morning sky palette, Fraunces (soft serif) for headlines and numbers with Nunito for UI text, both self-hosted. Glass cards, a floating pill tab bar, a living sky on Today that follows the real time of day (sun arc by hour, golden evenings, starry quiet nights), the breathing petal sun, and the rising sun with unfurling petals on the result screen. |
| Fair rewards | At most 2 free Seeds per week from all rewards combined (milestones, Sunbeam surprise, sharing, "You showed up"). At most 2 nudges per day. |
| Money | Seeds (credits) and Full Bloom (subscription). Checkout is a clearly labelled **DEMO**: nothing is charged and no payment details are asked for. At 0 Seeds on the free plan, a guided break opens the Seed shop. Quick breeze never uses a Seed. |
| Safety | No medical claims anywhere: LoosenUp is a wellbeing companion, not medical care, and says so on every screen. Let it out text is never stored. SOS and support are free forever and never need Seeds. |
| Privacy | All data stays on the device in localStorage (`loosenup.v1`). No accounts, no analytics, fonts are self-hosted. |
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
  fonts/        Nunito and Fraunces (self-hosted woff2)
  index.html    screens, sheets and tab bar
  styles.css    morning sky theme, safe areas, reduced motion
  app.js        engine (Seeds, XP, Sunny days, recommender) and UI
  sw.js         precaches the shell, cache-first for same-origin GET
  manifest.json standalone, id "/", 192, 512 and maskable icons
tests/          acceptance tests AT1 to AT13 (jsdom + Playwright)
scripts/        icon, splash and QR generators (Python Pillow and qrcode), native-setup.sh
android/ ios/   Capacitor native projects (appId com.loosenup.calm)
vercel.json     static hosting from www/ with sw.js no-cache and the manifest content type
```

## Develop and test

```bash
npm install
npm run serve            # http://127.0.0.1:4173
npm test                 # unit (jsdom) + browser (Playwright) suites
LIVE_URL=https://loosenup.vercel.app npm run test:live
```

The first browser run needs `npx playwright install chromium`. Screenshots from the browser suite land in `tests/screenshots/` at 390, 820 and 1440 px.

Regenerate icons and the QR code:

```bash
python3 -m venv .venv && .venv/bin/pip install pillow qrcode
.venv/bin/python scripts/make_icons.py --native
.venv/bin/python scripts/make_qr.py https://loosenup.vercel.app
```

## Native apps (Capacitor 8)

After `npx cap add android` or `npx cap add ios`, run `./scripts/native-setup.sh` to re-apply the icons, splash screens, notification icon and Android notification permission.

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
