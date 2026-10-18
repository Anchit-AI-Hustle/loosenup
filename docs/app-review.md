# LoosenUp product review

Reviewed: the committed build v2.0.2 (commit 84eb35c), as a phone user would see it. Screenshots are real captures at 390x844 in light and dark mode, plus a 360x640 small phone check, saved in `docs/review-shots/`. Reading load and a rough contrast check for each screen are in `docs/review-shots/metrics.json`.

Uncommitted work in the tree at review time (guided breathing with countdowns, timed step visuals, the emotion meter, games on Today, less text, the dark mode pass) is not in these screenshots. It is listed as in progress in section 5.

---

## 1. Verdict

**Overall: 6.5 out of 10.**

LoosenUp has a kind heart and a rare base. It is private by default, nothing is sold, SOS sits on every screen and it is properly grounded in India: Tele-MANAS, real services with prices, 25 in-person places, Hindi everywhere, a Stanley-Brown safety plan and WHO-5. Very few calm apps get the safety side this right. The trouble is the moment of need. Someone tense or low has to read and decide a lot before the first breath: three screens and about 135 words from Today, and five taps from a cold start. The shipped breathing screen is a word and a total timer, not a follow-along guide. Today runs to 3.4 phone screens and Find support to 8.4. Dark mode, used most by people at night when they are lowest, has several unreadable elements. LoosenUp also has no sleep audio and no route to a human inside the app beyond phone links. The pieces are good. LoosenUp now needs fewer of them, faster, with the strongest few made deeper.

---

## 2. Scores by page and feature

Scale 1 to 10. **Use** = useful to someone tense or low right now. **Clear** = how little reading it takes. **Design** = visual quality. **Access** = accessibility, including dark mode contrast and phone fit.

| Page or feature | Use | Clear | Design | Access | Why |
| --- | --- | --- | --- | --- | --- |
| Welcome | 6 | 8 | 7 | 6 | Short and warm with the language choice up front. The balloon is faded into the hills, and in dark mode the bright daytime scene glares against the night page. |
| How it works | 5 | 6 | 5 | 6 | Clear three steps, but a layout bug runs the lines together ("Notice how you feelRate your calm") because `.how-steps` has no styles. |
| Check-in (calm 1 to 10 plus context) | 6 | 5 | 8 | 6 | The rain to sun sky is lovely. Five space tabs and 18 chips is a lot for a tense mind, and the tab row clips "Relationships" with no scroll cue. |
| Pick | 6 | 4 | 7 | 7 | The "why this one" line is a nice touch, but audio and background settings sit here before Begin, adding 74 words and four decisions. |
| Session: breathing (shipped) | 6 | 9 | 7 | 6 | Calm petal sun, but only "Breathe in" and a 2:00 timer. No per-phase count or rounds, so it is hard to follow with eyes half shut. Rebuild in progress. |
| Session: step exercises (shipped) | 6 | 8 | 6 | 7 | Readable step card, but steps move on a fixed 24 seconds whatever the step, with no visual of what to do. Rebuild in progress. |
| Let it out | 7 | 9 | 6 | 7 | Private venting that is never saved, with crisis phrases opening SOS. A strong, rare feature. |
| After rating | 7 | 9 | 8 | 7 | One slider, prefilled with the before score so the default gain is zero. That is honest but easy to skim past. |
| Result | 6 | 6 | 8 | 7 | A joyful sunrise and a big gain number. The stat tiles repeat their labels ("Streak: 1 day in a row") and there is no "one more" or "how do you feel now" follow-up. |
| Today | 6 | 3 | 7 | 4 | 235 words over 3.4 screens. The streak shows three times and there are seven toolkit tiles. In dark mode the date and the space card titles are unreadable. |
| Mood check-in (five faces) | 7 | 9 | 8 | 7 | One tap with a kind note. "Crying" is a behaviour, not a mood, and tapping it opens the self-harm question every time. |
| Small steps and Good things jar | 7 | 7 | 7 | 7 | Behavioural activation done gently. The jar memory on heavy days is thoughtful. |
| Spaces carousel (Work, Relationships, Low days, Sleep) | 6 | 8 | 7 | 3 | A good entry by context. In dark mode the white titles sit on pastel cards and cannot be read. |
| Calm, Breathe tab | 6 | 5 | 7 | 7 | All 12 exercises in one place. Every card has the same orb, descriptions cut off mid sentence, and everything is 2 minutes long. |
| Calm, Games tab | 6 | 8 | 7 | 7 | Three clear cards. They are hidden one tab deep (moving to Today is in progress). |
| Calm Pairs | 6 | 8 | 7 | 7 | Gentle, with nothing timed. The exit button says "Back to Play" though the tab is called Calm. |
| Sunbeam Catch | 5 | 8 | 6 | 4 | A pleasant 45 seconds. In dark mode the jar counter is white on a white pill. Reduced motion is handled. |
| Breathing Ring | 7 | 7 | 7 | 7 | The best of the three: real paced breathing that you hold along with. It ends with a sync score, which is kind. |
| Sounds | 6 | 8 | 7 | 6 | Offline noise with a sleep timer. Only four generated textures, no voice or sleep content, and sound stops when the app is in the background. |
| Progress | 5 | 5 | 7 | 4 | Honest plain outcomes and a nice 7-day chart. The breaks and average tiles appear twice. The eight "Not yet" milestones are grey on grey in dark mode and read like a to-do list. |
| Me | 5 | 4 | 6 | 7 | 13 cards over 3.8 screens. The trusted person, the most important setting, is ninth. |
| Find support | 9 | 2 | 6 | 5 | The deepest and most useful India support page I have seen in a calm app, but it is 828 words over 8.4 screens. iCall has two different numbers on the same page, and Call 112 is white on coral in dark mode. |
| Safety plan | 8 | 6 | 6 | 7 | Stanley-Brown steps prefilled with helplines and one tap from SOS. Prefilled with the old iCall number. |
| Reframe a thought | 7 | 7 | 6 | 7 | A clean five-step thought record that saves only the kinder thought. There is no step back and no thinking-trap hints. |
| Learn (list) | 5 | 7 | 6 | 7 | Nine one-minute lessons with clear titles. |
| Lesson | 6 | 6 | 7 | 7 | Kind, plain writing with a "Try it" link to the matching exercise. Good. |
| Wellbeing check (WHO-5) | 6 | 6 | 6 | 7 | Validated and respectful, and low scores route to support. Six numbered buttons need the legend to make sense. Word labels would read faster. |
| Programmes (list) | 5 | 7 | 7 | 7 | Three sensible tracks (sleep, exams, burnout). |
| Programme day | 6 | 7 | 7 | 7 | A clear day card and grid. Day 4 onwards sits behind a demo paywall, and each day runs through the full three-screen break flow. |
| SOS sheet | 8 | 5 | 6 | 6 | Every right number is here, but there are seven equal-weight buttons plus a trusted-person form in the crisis sheet. 112 is styled like a minor option, and there is no text or WhatsApp route for someone who cannot speak. |
| Lowest-mood safety question | 7 | 8 | 7 | 7 | A direct, kind question, as good practice suggests. Asking it on every "Crying" tap risks people avoiding that face. |
| LoosenUp Plus sheet | 4 | 8 | 7 | 7 | Honest DEMO labelling. Plus offers only three programmes, which is thin value. |
| App lock | 7 | 8 | 6 | 7 | Salted PIN plus biometrics. The lock screen keeps an SOS button, which is good. |
| Hindi | 8 | 7 | 6 | 6 | Near-complete coverage, including Hindi crisis phrases. Uppercase letter-spacing on eyebrows pulls Devanagari apart, and "Quick breeze" and "Calm gain" stay in English mid-sentence. |
| Voice guide | 6 | 8 | n/a | 7 | A real human voice in English and Hindi is a differentiator, but it is off by default and some lines fall back to the device voice. |
| Install page | 5 | 6 | 6 | 7 | Clear steps, but sideloaded APKs and 7-day iPhone test builds put off most people. |
| Organisations (teams.html, org.html) | 6 | 7 | 6 | 6 | Privacy-first and well explained. The five-person threshold can be gamed (see problem 10). |
| Backup and restore | 6 | 8 | 6 | 7 | Needed with no accounts, and done simply. |

---

## 3. Top problems, ranked by how much they stop people getting value

1. **Too many steps before the first breath.** From Today: Start a calm break, then the check-in (slider, five space tabs, 18 chips, 61 words), then the Pick screen (74 words, voice and chime, four background sounds), then Begin. Quick breeze from the hero also goes through the check-in. A first-time user taps five times through about 250 words before breathing. People who are tense or low read least and quit soonest.
2. **The shipped session is not follow-along.** `#screen-session` shows a single cue word and a 2-minute total. There is no in/hold/out count, no rounds and no get-ready. Step exercises advance every 24 seconds (`seconds / steps.length`), so "name 5 things you can see" and "take one long breath" get the same time. Leading apps win on exactly this moment. (In progress.)
3. **Dark mode has real readability bugs on the most used screens.** Found in the screenshots (the dark pass is in progress; use this as its acceptance list):
   - Today hero: the mint date is on a peach card, and the greeting has a dark glow that smudges. The hero stays a bright daytime card at night.
   - Today Spaces cards: "Work" and "Relationships" titles are near white on pastel.
   - Sunbeam Catch: the "In your jar" counter is white on a white pill.
   - Progress: the "Not yet" milestones are grey text on grey tiles, and the chart day labels are faint.
   - Find support: the "Call 112" button is white on coral.
   - Welcome: a daylight scene with a hard fade into the dark page.
4. **Today and Me are long, and the streak is everywhere.** Today is 2,835 px (3.4 screens) with the streak in the hero pill, the progress strip and the rest-day line. Seven toolkit tiles compete with four spaces, two lifts and a programme card. Me has 13 cards. A low person cannot tell what to do first.
5. **Find support is excellent but exhausting, and its numbers conflict.** It is 828 words over 8.4 screens. The "Talk to someone now" card and the safety plan default both use iCall 022-25521111, while the partner card (from partners.js) says 9152987821. Tele-MANAS is "20 Indian languages" in one place and "18 more" in another. Conflicting numbers in a support page erode trust. These should come from one source with a test.
6. **The SOS sheet is crowded at the worst moment.** Seven buttons look nearly alike. 112 is a soft button below Tele-MANAS. A full "Add a trusted person" form sits inside the crisis sheet. There is no text option (the Vandrevala WhatsApp link exists on Find support but not in SOS), which matters for people who cannot talk out loud at home.
7. **The lowest mood face is labelled "Crying" and triggers the safety question on every tap.** Asking directly is right, but asking every time someone is tearful can feel alarming and may teach people to tap "Sad" instead. That makes the mood line and the three-heavy-days support card less reliable.
8. **Sleep and wind-down are thin.** For a nightly use case there are only four noise textures (sound stops in the background, "Keep LoosenUp open"), one sleep programme mostly behind the paywall, and no body scan, sleep story or night mode routine.
9. **Small polish issues that make it feel unfinished:** the How it works text runs together; the game screens say "Back to Play"; the check-in tab row clips with no cue; Calm cards cut descriptions mid sentence ("then one long, slow..."); result tiles repeat labels; the Sounds sleep timer wraps "60 min" onto its own row. Every exercise is 2 minutes, with no shorter or longer choice beyond Quick breeze.
10. **Organisation privacy can be gamed.** Pulses in `api/org.js` are unauthenticated beyond the join code, and the member id is any random string. An admin (or anyone with the code) can post four made-up pulses for a week to unlock the five-person view and single out one real member's mood. The admin key also travels in the dashboard URL hash (`/org.html#key=...`), so it stays in browser history.
11. **Distribution limits reach.** Android is a sideloaded APK and the iPhone app is a 7-day development build for registered devices. Most people will only meet the PWA, where reminders are in-app notes, not notifications.

---

## 4. Prioritised improvements

### In progress already (not recommended from scratch)

| Work | Status | What to check when it lands |
| --- | --- | --- |
| Guided breathing animation with a per-phase countdown, rounds and a get-ready | In progress | The count is large enough at arm's length, rounds sit under the orb, and screen readers hear each phase once, not every second. |
| Timed visual step exercises (icons, step timers, tap-to-count dots) | In progress | Step timings fit each step, and the dots do not block the Next button on a 360 px phone. |
| Emotion meter (angry, worried, sad, tired, lonely, overwhelmed, calm, happy, grateful and more, with intensity) and emotion metrics on Progress | In progress | One tap logs it without opening anything, and high-intensity heavy emotions offer a matching exercise, not SOS by default. |
| Games surfaced on Today | In progress | They replace something on Today rather than adding length. |
| Less text | In progress | Targets: Today under 120 words above the fold, Pick under 30, Find support first screen under 60. |
| Dark mode readability pass | In progress | The six items in problem 3, checked in real dark screenshots, not only by token. |

### P0: must do

| What to build | Why it matters for users | Size |
| --- | --- | --- |
| **One-tap calm.** "Breathe now" on Today and in SOS starts the session immediately. The calm rating becomes a single optional tap at the end (ask "before" as a quick recall), and the Pick screen is skipped unless someone taps "Choose another". Move voice, chime and background into a small settings button inside the session. | Puts the first breath within one tap and about ten words, where tense people actually are. | M |
| **Single source for helplines** (`partners.js` or a small `helplines.js`) feeding SOS, Find support, the safety plan default, install.html and README, with a unit test that all numbers match. Fix iCall now. | Trust. A conflicting or outdated number on a support page is the worst kind of error. | S |
| **SOS sheet rework.** Three large actions: Call Tele-MANAS 14416, Text someone (trusted person, or Vandrevala WhatsApp if none set), and Emergency 112 in the SOS colour. Put a one-line grounding prompt above them and fold the rest under "More options". Move trusted-person setup to onboarding (optional) and Me. | In a crisis, fewer, bigger, clearly ranked choices get used. A text route helps people who cannot speak freely at home. | S |
| **Gentler lowest mood.** Rename "Crying" to "Very low" (with tears kept on the face). Ask the safety question at most once a day, add a third answer "I just need a moment" that opens Kind words, and keep the current Yes path to SOS. | Keeps the honest mood signal and the safety net without making people dodge the lowest face. | S |
| **Polish bug sweep:** `.how-steps` layout, "Back to Play" to "Back to Calm", scrollable or wrapping space tabs, untruncated exercise one-liners, deduplicated result and Progress tiles. | Small breaks in polish read as "not ready" to new users and reviewers. | S |
| **Harden organisation privacy:** issue a signed per-member token at join, rate-limit pulses per token and per IP, add small random noise to weekly averages, and move the admin key out of the URL into a session. | The five-person promise must hold against the organisation itself, or colleges and employers stop trusting it. | M |

### P1: should do

| What to build | Why it matters for users | Size |
| --- | --- | --- |
| **Sleep space with real audio:** a 10 to 20 minute body scan and yoga nidra, and short sleep stories in English and Hindi using the recorded voice. Add background playback on the native apps, a fade-out timer and an automatic dim night mode after 10 pm. | Sleep is the most common nightly reason to open a calm app. Yoga nidra is familiar and trusted in India. | L |
| **A focused Today:** hero with "Breathe now", one-tap mood and emotion, one "for you right now" card (picked from time, mood and what has helped before), games, then "More help" folded. Streak appears once at most. | Halves the scroll and gives a low person one obvious next step. | M |
| **Streak-free, gentle habit framing:** replace "day streak" with "days you made time this week" against a soft weekly goal you choose (for example 3 of 7). Show only earned milestones plus the next one. | Leading apps moved away from streaks because a broken streak feels like a setback on a heavy day. | S |
| **Exercise lengths and depth:** 1, 3, 5 and 10 minute versions of the core breaths and Soft release, plus a longer body scan. Remember each person's preferred length. | Two minutes fits a desk break but not bedtime or a hard evening. | M |
| **Human support bridge:** a "Talk to someone" flow that asks three questions (now or this week, phone or chat, language and budget) and returns the top three options from partners.js, with one-tap call, WhatsApp or booking. Keep the full directory one tap deeper. Add a "Prepare for my first session" note that uses the first-call script. | Turns the strongest content in the app into a two-tap path to a human, which is what people on heavy weeks need most. | M |
| **Real reminders on the web:** Web Push for the PWA with a quiet-hours window, plus an optional evening wind-down nudge. | Most users are on the PWA, where reminders are only in-app notes today. | M |
| **Store distribution:** Play Store internal testing then production, and TestFlight then the App Store. | Sideloading and 7-day builds cap reach. Store presence also adds trust for a support app. | M |
| **Hindi polish and Hinglish:** remove letter-spacing on Devanagari eyebrows, record every voice line in Hindi, and offer Hinglish labels for the mood and emotion words. Then add Tamil, Bengali and Marathi, matching Tele-MANAS languages. | Language is LoosenUp's clearest edge over global apps in India. | M to L |
| **Haptic breathing:** a vibration pattern that paces in and out, so a session works with eyes shut or the screen off, on native and Android web. | Accessibility for low vision and for people in public who cannot watch a screen. | S |
| **Larger text setting** and a check that every screen works at 200 percent zoom and 320 px width. | Many users read on small, budget phones with large system fonts. | S |

### P2: nice to have

| What to build | Why it matters for users | Size |
| --- | --- | --- |
| Home screen and lock screen widget "Breathe now", plus a quick tile on Android. | Zero-navigation access at the moment of tension. | M |
| A weekly reflection card on Sunday: what helped most, the emotions that came up most, one gentle suggestion for next week. | Turns tracking into insight without more reading during the week. | S |
| Private journaling with short prompts, linked to emotions and Calm gain, kept on device with the app lock. | A gentle, private place to process, building on the emotion meter. | M |
| Seasonal packs for India: board exam weeks, festival-season family tension, monsoon low days, appraisal season. | Timely, local relevance that global apps do not offer. | M |
| A "Support a friend" flow from the lesson: what to say, how to ask directly, and sharing helplines in one tap. | Many people open a calm app because someone dear to them is struggling. | S |
| More games in the Breathing Ring style (paced tracing, slow colour matching), each tied to a breathing rhythm. | Play that still settles the body is the best kind for this app. | M |
| Organisation features: route members to the organisation's counsellor booking, and run anonymous campus or team challenges with no leaderboards. | Raises the value organisations pay for without touching privacy. | M |
| A richer LoosenUp Plus (sleep audio library, longer exercises, all programmes) once the free core is fast and simple. | Plus needs enough value to sustain the free SOS and support for everyone. | M |

### What to double down on

- **India-grounded real help:** verified helplines, real services with prices and ratings, in-person OPDs by city. No global competitor does this. Make it faster to reach, and keep it current with a checked date and a test.
- **Hindi and the human voice:** a calm human voice in Hindi is a reason to choose LoosenUp. Finish the recordings and turn the voice on by default for the first session (with an obvious off switch).
- **Safety without fear:** SOS everywhere, crisis phrase detection, a direct question and a safety plan. Keep this, and make it feel lighter and quicker.
- **Privacy:** no accounts, on-device data, an opt-in anonymous pulse. Say it once, clearly, and protect it at the server too.
- **Calm gain:** the before and after number is a simple, motivating outcome. Keep it, but make the "before" step optional so it never slows down the first breath.

---

## 5. Method notes

- Pages read in full: www/index.html, www/app.js, www/styles.css, www/i18n.js, www/partners.js, www/teams.html, www/org.html, www/install.html, api/org.js and README.md.
- Screenshots: Playwright 1.64 from the repo with `tests/helpers/serve.mjs` (`startServer(0)`), Chromium at 390x844 and deviceScaleFactor 2, with `colorScheme` set to light and then dark. A week of history was seeded through the app's own `completeSession` so Today and Progress show realistic content. Hindi and a 360x640 phone were spot checked in light mode.
- No screen scrolled sideways at 390 px or 360 px.
- The automatic contrast numbers in metrics.json ignore gradient backgrounds, so they flag the yellow buttons when those are actually fine. The dark mode issues in problem 3 were confirmed by eye in the screenshots.
- No medical claims are made in this review. LoosenUp is a wellbeing companion, not medical care.
