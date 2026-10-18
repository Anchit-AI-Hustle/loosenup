# LoosenUp

**Two calm minutes to loosen up and feel lighter.** LoosenUp's goal is simple: help people ease a tense day and soften a heavy, low mood, and make sure help is one tap away on the hardest days.

Rate how calm you feel, take a 2-minute guided break chosen for what you are carrying (work, relationships, low days, sleep), rate again, and see your **Calm gain**. A daily mood check-in, Small steps, Kind words and a Good things jar support low days. **SOS** sits in the header of every screen.

The brand mark is a petal sun that opens on every in-breath, unfurls on the result screen and sits in the app icon.

> A wellbeing companion, not medical care.

- **Live app:** https://loosenup-ios.anchit-tandon.com (iPhone and web), https://loosenup-android.anchit-tandon.com (Android install page), also https://loosenup.vercel.app
- **QR codes:** [loosenup-android-qr.png](loosenup-android-qr.png), [loosenup-ios-qr.png](loosenup-ios-qr.png)
- **Android APK:** `downloads/loosenup-android.apk` (served at `/download/loosenup-android.apk`; also `dist/loosenup-android-debug-v1.3.1.apk`)
- **Repository:** https://github.com/Anchit-AI-Hustle/loosenup (public)

## Install on your phone

| Platform | Link | QR code |
| --- | --- | --- |
| Android | https://loosenup-android.anchit-tandon.com | `loosenup-android-qr.png` |
| iPhone | https://loosenup-ios.anchit-tandon.com | `loosenup-ios-qr.png` |

- **Android (direct install):** open the Android link on the phone and tap **Download for Android**, open `LoosenUp.apk`, allow your browser to install apps if asked (Settings, then Install unknown apps), then tap Install. Direct file: https://loosenup-android.anchit-tandon.com/download/loosenup-android.apk. The full web app is at `/?app=1` on the same domain.
- **iPhone (native app):** open https://loosenup-ios.anchit-tandon.com/install.html in Safari on a registered test iPhone and tap **Install the iPhone app** (a development-signed build served with an Apple install manifest; it renews every 7 days and updates itself in between). **Any iPhone:** open the iPhone link in Safari, tap **Share**, then **Add to Home Screen**. Safari shows this tip on the welcome screen. A native iPhone install needs TestFlight, which needs an Apple Developer account (see Native apps below).

Both domains (and https://loosenup.vercel.app) serve the same Vercel project. `anchit-tandon.com` uses Vercel DNS, so HTTPS is automatic.

## What is inside

| Area | Details |
| --- | --- |
| SOS | An SOS button on every screen, even before onboarding. It opens Tele-MANAS 14416 (India, free, 24x7), emergency 112, findahelpline.com, a free 60 second breather and **Message my trusted person**: a pre-written text to someone you chose (saved on the device only), with your location added only if you switch that on. The phone's messaging app opens with the text ready; you tap Send. With no server, the app cannot send messages silently. |
| Detecting hard moments | Crisis phrases (for example suicide, kill myself, end it all, self harm, want to die) are checked in every text box: Let it out and the Good things jar. A match opens SOS straight away and the text is not saved. Choosing the lowest mood asks one direct, gentle question: "Are you having thoughts of ending your life or hurting yourself?" Yes opens SOS. Three heavy check-ins in a row bring up a "you do not have to carry it alone" card. |
| Spaces | **Work:** Work pile-up, Before a meeting, After a tough call, Hard to switch off, with Desk reset and Steady square (box breathing). **Relationships:** Tense with someone, After a disagreement, Before a hard talk, Feeling disconnected, with Pause before replying, Cool down (long breath out) and Warm wishes. **Low days:** Feeling low, Low energy, Hard on myself, with Kind words (self-compassion). **Sleep:** Winding down, Mind racing at night. |
| Lifting low days | **Mood check-in** once a day with five faces (Crying, Sad, Okay, Decent, Happy) and a level bar, feeding a mood line and trend insight on Progress. **Small steps:** one tiny doable action at a time, based on behavioural activation. **Good things jar:** saved only when you tap Save; on heavy days a saved good thing resurfaces. |
| Find support | Verified helplines (Tele-MANAS 14416, Vandrevala +91 9999 666 555 call or WhatsApp, iCall 022-25521111, emergency 112), a near-me finder for psychiatrists, psychologists, counsellors and low-cost hospital OPDs (opens Apple Maps on iPhone, Google Maps elsewhere; LoosenUp never sees the location), which professional to choose, a copyable first-call script, questions to ask, and My care team with a call button and a native reminder an hour before the next session. |
| Safety plan | The six Stanley-Brown steps plus what matters most, saved on device, prefilled with helplines, one tap from SOS. |
| Reframe a thought | A five-step CBT thought record with before and after ratings. Only the kinder thought can be kept (in the Good things jar); everything else is cleared. Crisis phrases open SOS. |
| Calm sounds | Rain, ocean, deep hush (brown noise) and breeze generated on the device with Web Audio, volume and a 15, 30 or 60 minute sleep timer. Works offline. |
| Wellbeing check | The WHO-5 Wellbeing Index every two weeks (0 to 100) with a trend. Lower scores point to Find support; very low scores open SOS. A check-in, not a diagnosis. |
| Hindi (हिन्दी) | Choose English or हिन्दी on Welcome or in Me. Every screen, tool, lesson, game, sheet, toast and notification switches to Hindi (www/i18n.js, about 700 entries plus sentence patterns for names and counts); brand words such as LoosenUp, Calm gain and technique names stay in English. The voice guide speaks Hindi with the phone's hi-IN voice, dates use Hindi month names, and the SOS text to a trusted person is written in Hindi. Hindi and Hinglish crisis phrases (for example आत्महत्या, मरना चाहता, जीना नहीं चाहती, khudkushi, marna chahta) open SOS. Switching back restores the English exactly. |
| App lock | An optional 4 to 6 digit PIN (stored only as a salted SHA-256 hash) with Face ID or fingerprint on the phone apps. LoosenUp asks again after a minute in the background. A forgotten PIN can only be cleared by starting fresh, then restoring a backup. |
| Dark mode | Auto (follows the phone), Light or Dark, applied before the first paint so there is no flash. |
| Learn | Nine one-minute lessons: long breath out, thoughts are guesses, action first on heavy days, sleep, self-kindness, boundaries at work, repair after a disagreement, supporting a friend, and when to talk to a professional. Each ends with a takeaway and a Try it button that opens the matching break or tool. |
| Audio-guided breaks | Optional voice narration (intro, each cue, a kind close), soft chimes when the breath changes, and a background bed of rain, ocean or brown noise, all remembered for next time. |
| Backup and restore | Save a JSON backup file and restore it on a new phone. The previous data is kept for undo. |
| Live updates | The iPhone and Android apps check /updates/latest.json on loosenup-ios.anchit-tandon.com, download the checksum-verified bundle and apply it next launch (@capgo/capacitor-updater in self-hosted mode, no third-party servers). Run scripts/build-web-update.sh before each deploy. |
| First open | Welcome (first name), a three-step "How LoosenUp helps" screen (notice how you feel, take two calm minutes, see your Calm gain), then straight into the first break. No paywall, nothing to buy. |
| Break loop | Calm before (1 to 10) and a context chip, an auto-picked technique with the reason, the guided session (breathing orb or step counter, optional device voice, pause, finish early), calm after, then the result with the rising sun. |
| Techniques | Everyday: Sigh of relief, Slow breeze, Here and now, Soft release (opens after 3 breaks), Let it out (opens after 5 breaks). Work: Desk reset, Steady square. Relationships: Pause before replying, Cool down, Warm wishes. Low days: Kind words. Quick breeze is a 60s preset that is always free. |
| Recommender | Rule based by context on day one. After 2 or more breaks with a technique in a context, the technique with the best average Calm gain for that context is preferred. Techniques that are not open yet are never picked. |
| Progress (2.0) | Plain outcomes instead of game points: day streak (one calendar day each, one rest day a week keeps it going), total breaks, average Calm gain, the latest WHO-5 wellbeing score, the 7-day Calm gain chart with the mood line, what helps you most, and plain-language milestones (3, 7, 21 and 30 days in a row, ten breaks, a +5 Calm gain, tried every exercise). No Seeds, XP, levels or garden. |
| Guided programmes (LoosenUp Plus) | **Better sleep in 21 days**, **Exam calm** (14 days, for students) and **Recovering from burnout** (21 days). One day opens per calendar day: a short tip plus a paired exercise, with the before and after Calm gain. Days 1 to 3 are free; LoosenUp Plus (₹149 a month or ₹799 a year, demo checkout) opens the rest. Finishing one earns the Finisher badge. |
| Real services | Find support lists 11 real online services (Tele MANAS, iCall, Vandrevala, Mpower 1on1, Amaha, MindPeers, Lissun, BetterLYF, Manastha, Practo, Wysa) with type, modes, languages, published prices and Google Play ratings, filterable by Free, Therapy, Psychiatry and Hindi, each linking to its own booking page. **In person:** 25 places across 12 cities (government psychiatry OPDs, NGOs and clinics) with call, directions and website; Use my location picks the nearest city and sorts by distance on the phone. Data in www/partners.js, checked on official sites on 18 Oct 2026. LoosenUp is not paid by any of them. |
| Organisations | Colleges and companies create an organisation at /teams.html and get a join code plus a one-time admin key. Members add the code in Me, can turn on an anonymous weekly pulse (average mood, Calm gain, breaks, top three feelings; never names, notes or SOS), and see the organisation's own support line in SOS. The dashboard at /org.html shows a week only when 5 or more people shared it. Backend: one Vercel function (api/org.js) on a free Neon Postgres database (Singapore), connected through the Vercel marketplace. |
| Recorded voice | The voice guide plays clips of Anchit's own voice, recreated with Chatterbox Multilingual (MIT licence, watermarked) in English and Hindi, from www/voice. Each exercise also opens with its one-line description. Lines without a clip use the device voice. Generate with scripts/make_voice.py, then node scripts/voice-manifest.mjs. |
| Mood check | A living sky: rain and heavy clouds at 1, clouds parting in the middle, the petal sun rising and glowing at 10, with a slate to gold slider, a popping number and a light haptic tick. |
| Calm (one screen, three tabs) | The second tab, **Calm**, holds everything you do to settle in one place, behind a sliding Breathe, Games and Sounds switch (tap, swipe sideways or use the arrow keys). **Breathe** shows all 12 exercises as cards grouped into Breathing and Body and mind, each with a breathing orb, its length and its space; locked ones say how many breaks until they open. Tapping a card still asks how calm you feel before and after, so the Calm gain counts. **Games** holds the three games and **Sounds** holds rain, ocean, deep hush and breeze with volume and the sleep timer. The Calm sounds tool on Today opens the Sounds tab. |
| Play | Three calm mini-games on the Games tab of Calm, each ending kindly: **Calm Pairs** (memory match with calm symbols), **Sunbeam Catch** (45 seconds of tapping drifting sunbeams) and **Breathing Ring** (hold to breathe in with a growing ring, let go to breathe out, six slow breaths). |
| Design | Morning sky palette, Fraunces (soft serif) for headlines and numbers with Nunito for UI text, both self-hosted. Glass cards, a floating pill tab bar, a living sky on Today that follows the real time of day (sun arc by hour, golden evenings, starry quiet nights), the breathing petal sun, and the rising sun with unfurling petals on the result screen. |
| Free core | Every calm break, every exercise from day one, the toolkit and SOS are free forever. Nothing is metered. |
| Money | **LoosenUp Plus** (₹149 a month or ₹799 a year) opens every day of every guided programme; days 1 to 3 of each are free. **Organisations** pay per member (preview pricing on /teams.html). Checkout is a clearly labelled **DEMO**: nothing is charged and no payment details are asked for. |
| Safety | No medical claims anywhere: LoosenUp is a wellbeing companion, not medical care, and says so on every screen. Let it out text is never stored. SOS and support are free forever. |
| Privacy | All data stays on the device in localStorage (`loosenup.v1`). No accounts, no analytics, fonts are self-hosted. |
| Daily reminder | A daily time you choose. On the web it shows a gentle in-app note. On the Android and iOS apps it schedules one real local notification per day. |

### Prices (placeholders)

| Item | INR | USD |
| --- | --- | --- |
| LoosenUp Plus, monthly | ₹149 / month | USD 4.99 / month |
| LoosenUp Plus, yearly | ₹799 / year | USD 34.99 / year |

Exchange rate check on 17 Oct 2026 (open.er-api.com, updated 00:02 UTC): **USD 1 = ₹95.11**. At that rate USD 6.99 is about ₹665, so the INR prices sit at roughly 45 percent of the USD prices. That is a deliberate purchasing power discount for India, in line with common app store regional pricing. Revisit before going live.

## Project layout

```
www/            the web app (PWA). Also the Capacitor webDir.
  fonts/        Nunito and Fraunces (self-hosted woff2)
  index.html    screens, sheets and tab bar
  styles.css    morning sky theme, safe areas, reduced motion
  app.js        engine (Calm gain, day streak, recommender, programmes) and UI
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

### Daily reminders

`@capacitor/local-notifications` schedules a single repeating notification (id 1) at the chosen time, so there is never more than one reminder a day. Android 13 and newer ask for notification permission the first time you save a the daily reminder.

## Deploy

Vercel serves `www/` as static files (no build step). `vercel.json` sets `Cache-Control: no-cache` on `sw.js` and `application/manifest+json` on `manifest.json`.
