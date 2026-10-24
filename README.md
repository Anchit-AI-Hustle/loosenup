# LoosenUp

**Two calm minutes to loosen up and feel lighter.** LoosenUp's goal is simple: help people ease a tense day and soften a heavy, low mood, and make sure help is one tap away on the hardest days.

Rate how calm you feel, take a 2-minute guided break chosen for what you are carrying (work, relationships, low days, sleep), rate again, and see your **Calm gain**. A daily mood check-in, Small steps, Kind words and a Good things jar support low days. **SOS** sits in the header of every screen.

The brand mark is a petal sun that opens on every in-breath, unfurls on the result screen and sits in the app icon.

> A wellbeing companion, not medical care.

- **Live app:** https://loosenup.anchit-tandon.com (website and mobile website). **Every downloadable signed app:** https://loosenup.anchit-tandon.com/get. Also https://loosenup.vercel.app
- **QR code:** [loosenup-get-qr.png](loosenup-get-qr.png) opens /get
- **Android APK:** `downloads/loosenup-android.apk` (served at `/download/loosenup-android.apk`; also `dist/loosenup-android-debug-v1.3.1.apk`)
- **Repository:** https://github.com/Anchit-AI-Hustle/loosenup (public)

## Install on your phone

| Platform | Link | QR code |
| --- | --- | --- |
| Android | https://loosenup.anchit-tandon.com/get | `loosenup-android-qr.png` |
| iPhone | https://loosenup.anchit-tandon.com | `loosenup-ios-qr.png` |

- **Android (direct install):** open the Android link on the phone and tap **Download for Android**, open `LoosenUp.apk`, allow your browser to install apps if asked (Settings, then Install unknown apps), then tap Install. Direct file: https://loosenup.anchit-tandon.com/download/loosenup-android.apk. The full web app is at https://loosenup.anchit-tandon.com.
- **iPhone and iPad:** open https://loosenup.anchit-tandon.com/get in Safari and tap **Install on iPhone**, then **Allow**; open Settings, tap **Profile Downloaded**, then **Install**. LoosenUp appears on the home screen as a full-screen app (an Apple Web Clip profile, `www/loosenup.mobileconfig`, built by `node scripts/make-webclip.mjs`; the same way The Third Eye installs). No Mac, App Store or developer account is involved. Safari's **Share**, then **Add to Home Screen**, also works. It opens full screen, works offline and has every feature. `/get` shows these steps first on an iPhone. There is no web install of the native app: apps signed with a free Apple ID can only be installed from a Mac, and a refused web install removes the copy already on the phone. A native install for anyone needs TestFlight, which needs an Apple Developer account (see Native apps below).

Both domains (and https://loosenup.vercel.app) serve the same Vercel project. `anchit-tandon.com` uses Vercel DNS, so HTTPS is automatic.

## What is inside

| Area | Details |
| --- | --- |
| SOS | An SOS button on every screen, even before onboarding. It shows a grounding line with **Breathe now** and three large, ranked actions: **Call Tele-MANAS 14416** (India, free, 24x7), **Text someone** (your trusted person, or Vandrevala Foundation on WhatsApp, +91 9999 666 555, if none is set) and **Emergency 112** in the SOS colour. Everything else (safety plan, Find support, findahelpline.com, your organisation's line, adding your location) is folded under More options. The trusted person (saved on the device only) is set up in Me, never inside the crisis sheet. The phone's messaging app opens with the text ready; you tap Send. With no server, the app cannot send messages silently. Every helpline number comes from www/helplines.js, and a unit test checks that the app, install page, partners list and this README all match it. |
| Detecting hard moments | Crisis phrases (for example suicide, kill myself, end it all, self harm, want to die) are checked in every text box: Let it out and the Good things jar. A match opens SOS straight away and the text is not saved. Choosing the lowest mood asks one direct, gentle question: "Are you having thoughts of ending your life or hurting yourself?" Yes opens SOS. Three heavy check-ins in a row bring up a "you do not have to carry it alone" card. |
| Spaces | **Work:** Work pile-up, Before a meeting, After a tough call, Hard to switch off, with Desk reset and Steady square (box breathing). **Relationships:** Tense with someone, After a disagreement, Before a hard talk, Feeling disconnected, with Pause before replying, Cool down (long breath out) and Warm wishes. **Low days:** Feeling low, Low energy, Hard on myself, with Kind words (self-compassion). **Sleep:** Winding down, Mind racing at night. |
| Lifting low days | **Mood check-in** once a day with five faces (Crying, Sad, Okay, Decent, Happy) and a level bar, feeding a mood line and trend insight on Progress. **Small steps:** one tiny doable action at a time, based on behavioural activation. **Good things jar:** saved only when you tap Save; on heavy days a saved good thing resurfaces. |
| Find support | Verified helplines (Tele-MANAS 14416, Vandrevala +91 9999 666 555 call or WhatsApp, iCall 9152987821, emergency 112), a near-me finder for psychiatrists, psychologists, counsellors and low-cost hospital OPDs (opens Apple Maps on iPhone, Google Maps elsewhere; LoosenUp never sees the location), which professional to choose, a copyable first-call script, questions to ask, and My care team with a call button and a native reminder an hour before the next session. |
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
| Live updates | The iPhone and Android apps check /updates/latest.json on loosenup.anchit-tandon.com, download the checksum-verified bundle and apply it next launch (@capgo/capacitor-updater in self-hosted mode, no third-party servers). Run scripts/build-web-update.sh before each deploy. |
| First open | Welcome (first name), a three-step "How LoosenUp helps" screen (notice how you feel, take two calm minutes, see your Calm gain), then straight into the first break. No paywall, nothing to buy. |
| Break loop | Calm before (1 to 10) and a context chip, an auto-picked technique with the reason, the guided session (breathing orb or step counter, optional device voice, pause, finish early), calm after, then the result with the rising sun. |
| Techniques | Everyday: Sigh of relief, Slow breeze, Here and now, Soft release (opens after 3 breaks), Let it out (opens after 5 breaks). Work: Desk reset, Steady square. Relationships: Pause before replying, Cool down, Warm wishes. Low days: Kind words. Quick breeze is a 60s preset that is always free. |
| Recommender | Rule based by context on day one. After 2 or more breaks with a technique in a context, the technique with the best average Calm gain for that context is preferred. Techniques that are not open yet are never picked. |
| Follow-along guides (2.1) | Every exercise is a guided simulation. **Breathing:** a 3 second get-ready countdown with three how-to tips, a pattern strip with the exact timings (for example In 4s, Hold 4s, Out 4s, Rest 4s) lighting the live phase, a circle that grows and shrinks in time with a countdown inside it and a ring tracing the phase, and "Round 3 of 8". **Step exercises:** a big icon, a 24 second ring per step, tap-to-count dots (Here and now: 5 things you see, 4 you feel and so on), and two-part cues such as "Tense · 5" then "Let go · 7" with the circle squeezing and opening. |
| Emotion meter (2.1) | Under the five mood faces, 14 emotions (Angry, Worried, Sad, Tired, Lonely, Overwhelmed, Frustrated, Restless, Calm, Happy, Grateful, Hopeful, Loved, Energetic). Each tap sets the intensity: a little, quite, very. The strongest difficult emotion suggests a matching exercise in one tap (Angry: Cool down; Worried: Steady square; Lonely: Warm wishes). Progress shows each emotion over the week with a trend against the week before. |
| Games on Today (2.1) | A "Play a calm game" row with all three games one tap from Today; Back returns to Today. |
| One-tap calm (2.2) | **Breathe now** on Today and in SOS starts a guided Quick breeze at once, with no check-in and no Pick screen. At the end you rate how calm you feel now, and the before rating is one optional tap; with it, the Calm gain counts as usual, and without it the break still counts but stays out of every Calm gain average. Voice, chimes and background sound sit behind a Sound button inside the session. **Choose a calm break** keeps the full check-in and pick. |
| Shorter pages (2.2) | Today keeps one streak line (in the sky card), the games row and the mood check-in near the top, and four toolkit tiles (Find support, Safety plan, Reframe a thought, Learn); Programmes moved to the Calm tab and the wellbeing check lives on Progress. Find support opens with the four helplines; the longer guides (booking, in person, which professional, first call, care team) are folded. |
| For you right now (2.3) | One card on Today picks an exercise for this moment, from the strongest difficult feeling you tapped, then your mood, then the time of day. **Start** goes straight into it. The safety question also offers **I just need a moment**, which starts Breathe now. |
| Sleep (2.3) | Four guided sessions in English and Hindi (body scan, yoga nidra and two sleep stories) in Anchit's recorded voice, with background sound, a dimmed screen, and a choice to fade to silence or keep the sound for 15 or 30 minutes. From Today and from Sounds. |
| Exercise length and weekly goal (2.3) | Every exercise except Quick breeze runs for 1, 2, 3, 5 or 10 minutes. A weekly goal (days a week you choose) replaces streaks, and milestones count calm days in total, so a quiet day never resets anything. Progress adds a weekly reflection. |
| Comfort settings (2.3) | Breathing vibration (light taps breathing in, one long pulse breathing out) in the apps and Android browsers, and Normal, Large or Larger text. |
| Journal, friend, packs (2.3) | A private journal saved only on the phone when you tap Save; Support a friend (what to notice, say and ask, and one tap to share helplines); seasonal packs for board exams, appraisal season, monsoon and festivals. |
| Trace the square (2.3) | A calm game: keep a finger on a dot travelling round a square, four seconds a side, as you box breathe. |
| Talk to someone (2.3) | Three taps (when, how, language and budget) show the three best fits from the real services list, with a Prepare for my first session checklist. |
| Web reminders (2.3) | The website sends a real daily notification at the chosen time (Web Push from /api/push, triggered every 15 minutes by .github/workflows/reminders.yml). On iPhone this needs LoosenUp added to the home screen. |
| Readability | Text contrast is checked on every screen in light and dark mode (WCAG AA) by the AT35 browser test, and phone fit at 320, 360 and 390 px by AT32. |
| Progress (2.0) | Plain outcomes instead of game points: day streak (one calendar day each, one rest day a week keeps it going), total breaks, average Calm gain, the latest WHO-5 wellbeing score, the 7-day Calm gain chart with the mood line, what helps you most, and plain-language milestones (3, 7, 21 and 30 days in a row, ten breaks, a +5 Calm gain, tried every exercise). No Seeds, XP, levels or garden. |
| Guided programmes (LoosenUp Plus) | **Better sleep in 21 days**, **Exam calm** (14 days, for students) and **Recovering from burnout** (21 days). One day opens per calendar day: a short tip plus a paired exercise, with the before and after Calm gain. Days 1 to 3 are free; LoosenUp Plus (₹149 a month or ₹799 a year, demo checkout) opens the rest. Finishing one earns the Finisher badge. |
| Real services | Find support lists 11 real online services (Tele MANAS, iCall, Vandrevala, Mpower 1on1, Amaha, MindPeers, Lissun, BetterLYF, Manastha, Practo, Wysa) with type, modes, languages, published prices and Google Play ratings, filterable by Free, Therapy, Psychiatry and Hindi, each linking to its own booking page. **In person:** 25 places across 12 cities (government psychiatry OPDs, NGOs and clinics) with call, directions and website; Use my location picks the nearest city and sorts by distance on the phone. Data in www/partners.js, checked on official sites on 18 Oct 2026. LoosenUp is not paid by any of them. |
| Organisations | Colleges and companies create an organisation at /teams.html and get a join code plus a one-time admin key. Members add the code in Me, can turn on an anonymous weekly pulse (average mood, Calm gain, breaks, top three feelings; never names, notes or SOS), and see the organisation's own support line in SOS. The dashboard at /org.html shows a week only when 5 or more people shared it. Backend: one Vercel function (api/org.js) on a free Neon Postgres database (Singapore), connected through the Vercel marketplace. |
| Recorded voice | The voice guide plays clips of Anchit's own voice, recreated with Chatterbox Multilingual (MIT licence, watermarked) in English and Hindi, from www/voice. Each exercise also opens with its one-line description. Lines without a clip use the device voice. Generate with scripts/make_voice.py, then node scripts/voice-manifest.mjs. |
| Mood check | A living sky: rain and heavy clouds at 1, clouds parting in the middle, the petal sun rising and glowing at 10, with a slate to gold slider, a popping number and a light haptic tick. |
| Calm (one screen, three tabs) | The second tab, **Calm**, holds everything you do to settle in one place, behind a sliding Breathe, Games and Sounds switch (tap, swipe sideways or use the arrow keys). **Breathe** shows all 12 exercises as cards grouped into Breathing and Body and mind, each with a breathing orb, its length and its space; locked ones say how many breaks until they open. Tapping a card still asks how calm you feel before and after, so the Calm gain counts. **Games** holds the three games and **Sounds** holds rain, ocean, deep hush and breeze with volume and the sleep timer. A Programmes card sits under the exercises. |
| Play | Three calm mini-games on the Games tab of Calm, each ending kindly: **Calm Pairs** (memory match with calm symbols), **Sunbeam Catch** (45 seconds of tapping drifting sunbeams) and **Breathing Ring** (hold to breathe in with a growing ring, let go to breathe out, six slow breaths). |
| Design | Morning sky palette, Fraunces (soft serif) for headlines and numbers with Nunito for UI text, both self-hosted. Glass cards, a floating pill tab bar, a living sky on Today that follows the real time of day (sun arc by hour, golden evenings, starry quiet nights), the breathing petal sun, and the rising sun with unfurling petals on the result screen. |
| Free core | Every calm break, every exercise from day one, the toolkit and SOS are free forever. Nothing is metered. |
| Money | **LoosenUp Plus** (₹149 a month or ₹799 a year) opens every day of every guided programme; days 1 to 3 of each are free. **Organisations** pay per member (preview pricing on /teams.html). Checkout is a clearly labelled **DEMO**: nothing is charged and no payment details are asked for. |
| Safety | No medical claims anywhere: LoosenUp is a wellbeing companion, not medical care, and says so on every screen. Let it out text is never stored. SOS and support are free forever. |
| Privacy | All data stays on the device in localStorage (`loosenup.v1`). No accounts, no analytics, fonts are self-hosted. |
| Daily reminder | A daily time you choose. On the web it shows a gentle in-app note. On the Android and iOS apps it schedules one real local notification per day. |

### LoosenUp Plus (real subscriptions)

| | India (Razorpay) | Everywhere else (Paddle) |
| --- | --- | --- |
| Monthly | ₹149 | US$4.99 plus local tax |
| Yearly | ₹799 | US$34.99 plus local tax |
| Pays with | UPI, UPI Autopay, cards, netbanking | Cards, Apple Pay, Google Pay, PayPal |
| Tax | You file GST | Paddle is the merchant of record and handles sales tax and VAT |

**What Plus opens:** every programme day after day 3, every sleep session (the body scan stays free), and every seasonal pack. Breathing, games, the journal, SOS, helplines and the safety plan are always free. Until a payment provider is configured, nothing is locked.

**How it works:** Choose a plan → `/api/plus` makes a Plus key (stored only as a hash) → `/plus.html#k=…` opens Razorpay or Paddle (in the browser on phones) → a signed payment (Razorpay) or a signed webhook (Paddle) turns Plus on → the app checks the key on launch and when it comes back. Webhooks keep renewals, failed payments and cancellations current. The key restores Plus on another phone (Me → Restore Plus). Cancel in Me keeps Plus to the end of the paid period. Policies: `/terms.html`, `/privacy.html`, `/refunds.html`.

**Two Razorpay modes.** With only `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` set, Razorpay runs as Standard Checkout: `checkout` creates an order for ₹149 or ₹799, the page opens Razorpay with that `order_id`, and `verify` turns Plus on for one month or one year only when HMAC-SHA256(`order_id|payment_id`, key secret) matches and Razorpay confirms that payment captured the right amount for that order. It does not renew; the app says so. The `order.paid` webhook covers a page that closed before confirming. Once Razorpay Subscriptions is enabled on the account and `RAZORPAY_PLAN_MONTHLY` and `RAZORPAY_PLAN_YEARLY` are set, Razorpay switches to renewing subscriptions (UPI Autopay). The sandbox runs as Standard Checkout today, because Subscriptions is not enabled on the test account. Razorpay's webhook secret is in `~/.config/loosenup/razorpay-webhook-secret` on the Mac that set it up; add the webhook in Razorpay with the events order.paid plus the subscription events below.

**Trying the other region's checkout.** While both providers run on test keys (`rzp_test_` and `PADDLE_ENV=sandbox`), `/plus.html#country=US` (or `?country=` on the API) shows the checkout that country would see, so Paddle can be tested from India. With any live key the server ignores it and always follows the visitor's real country.

**Turning payments on (sandbox first):**

1. Razorpay: sign up, stay in Test Mode, create API keys. Then add a webhook to `https://loosenup.anchit-tandon.com/api/plus?hook=razorpay` with a secret, for these events: subscription.activated, charged, pending, halted, cancelled and completed.
2. Paddle: sign up for a sandbox account and create an API key and a client-side token. Add a notification destination to `https://loosenup.anchit-tandon.com/api/plus?hook=paddle` for subscription events. Set **Checkout → Checkout settings → Default payment link** to `https://loosenup.anchit-tandon.com/plus.html` (without it Paddle refuses every checkout with `transaction_default_checkout_url_not_set`). Approve the domain `loosenup.anchit-tandon.com` before going live.
3. Create the plans: `RAZORPAY_KEY_ID=… RAZORPAY_KEY_SECRET=… PADDLE_API_KEY=… PADDLE_ENV=sandbox node scripts/setup-payments.mjs`
4. Add these to Vercel (Production): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_PLAN_MONTHLY`, `RAZORPAY_PLAN_YEARLY`, `PADDLE_CLIENT_TOKEN`, `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`, `PADDLE_PRICE_MONTHLY`, `PADDLE_PRICE_YEARLY` and `PADDLE_ENV` (`sandbox`, then `production`). Then redeploy.
5. Go live: finish Razorpay KYC and Paddle's seller verification, swap in the live keys, run step 3 again with live keys, and set `PADDLE_ENV=production`.

## Feelings

The For you card on Today starts from what someone feels (the mood faces and the feeling chips, each with a strength of a little, quite or very) and builds a short plan in `www/feelings.js`. Every plan has the same shape: a caring line first, then settle the body (or lift it gently when energy is low), then shift attention or meaning, then a small win and a closing line. Something else swaps to a second plan, the Today games show only the ones that suit the feeling, and each finished step offers the next one.

Crying leads, then the strongest heavier feeling (high-energy ones first when strengths tie), then the mood, then good feelings, which are savoured rather than fixed. At night a worried, overwhelmed or restless mind gets the racing-mind plan, and no fast games are offered.

The choices follow the research, which mostly tested repeated practice, so the app only says things like "can help you feel calmer":

- Long breaths out (cyclic sighing) lifted mood more than box breathing in Balban et al. 2023 (Cell Reports Medicine), and breath holds can make a panicky body feel worse, so worry starts with Sigh of relief, never Steady square.
- Anger cools with activities that lower arousal (slow breathing, muscle release, a pause), not with venting or fast games (Kjaervik and Bushman 2024, 154 studies; Bushman 2002).
- Naming a feeling lowers the brain's alarm response (Lieberman 2007), so feeling chips and Name it come early.
- Self-compassion helps self-criticism and brooding (Ferrari 2019 meta-analysis); big positive affirmations can backfire for people who feel low (Wood 2009).
- Writing a worry down with a next step or a time quiets unfinished thoughts (Masicampo and Baumeister 2011); a to-do list for tomorrow helped people fall asleep faster (Scullin 2018).
- Low energy and a flat mood are lifted with movement, daylight and one small valued action (behavioural activation), not calmed further.
- Good feelings last longer when savoured and shared (Bryant's savouring work; Gable 2004).
- Simple visuospatial games give a looping mind something else to hold (Holmes and Iyadurai). Bubble Pop and Calm Pairs end with something finished, and none of the calming games keeps score against you.

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

LoosenUp is signed with a free Apple ID (team 6D7XLS9CRH), so the native iPhone app runs only on the iPhones registered to it, each build works for 7 days, and only a Mac can install it (never a web link). `scripts/renew-iphone.sh` keeps it going: when 3 days or less are left it rebuilds and re-signs the app and installs it on your iPhone (cable, or the same Wi-Fi after pairing once). If the iPhone is not reachable, the next check installs it. `FORCE=1` renews right away. To run the check every day at 10:00:

```bash
cp scripts/com.loosenup.renew-iphone.plist ~/Library/LaunchAgents/ && launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.loosenup.renew-iphone.plist
```

The log is `~/Library/Logs/loosenup-renew-iphone.log`. The iPhone app file is not kept in git.


### Daily reminders

`@capacitor/local-notifications` schedules a single repeating notification (id 1) at the chosen time, so there is never more than one reminder a day. Android 13 and newer ask for notification permission the first time you save a the daily reminder.

## Deploy

`bash scripts/deploy.sh` deploys the committed code (HEAD) to production.

Vercel serves `www/` as static files (no build step). `vercel.json` sets `Cache-Control: no-cache` on `sw.js` and `application/manifest+json` on `manifest.json`.
