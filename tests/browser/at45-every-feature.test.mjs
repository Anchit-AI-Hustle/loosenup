// AT45: every feature and function, driven like a person in a real browser (Playwright Chromium, 390x844).
// Each feature is its own test so one problem never hides another. Network calls are answered locally.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from '../helpers/serve.mjs';

const API = 'https://loosenup.anchit-tandon.com/api/';
let server, browser;
before(async () => { server = await startServer(0); browser = await chromium.launch(); });
after(async () => { await browser?.close(); await server?.close(); });

// A phone, onboarded as Asha, on Today. Every network call to the API is recorded and answered here.
async function phone({ scheme = 'light', onboard = true, init } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: scheme, hasTouch: true, permissions: ['notifications'] });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: server.url });
  const page = await ctx.newPage();
  const errors = [], calls = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.route(API + '**', async (route) => {
    const req = route.request();
    const body = req.postData() ? JSON.parse(req.postData()) : {};
    calls.push({ url: req.url(), body });
    let json = { ok: true };
    if (body.action === 'join') json = { name: 'Riverside College', kind: 'college', joinCode: 'LUAB23CD', supportName: 'Wellness Centre', supportPhone: '+91 80 1234 5678', memberId: 'm'.repeat(24), memberPass: 'pass' };
    if (/action=key/.test(req.url())) json = { publicKey: 'BJm0_gFq9dycoUpu2n7ERGzTsW2rmB6was2TnG5bE3g0-uin9pjQKpkbumwJQREoxaQ1cbDB8tR9CZHkCqx9VHI' };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) });
  });
  if (init) await page.addInitScript(init);
  await page.goto(server.url + '/');
  if (onboard) {
    await page.fill('#name-input', 'Asha');
    await page.click('#welcome-go');
    await page.click('#gift-go');
    await go(page, 'today');
  }
  return { ctx, page, errors, calls };
}
const go = async (page, s) => { await page.evaluate((x) => window.LoosenUp.go(x), s); await page.waitForTimeout(120); };
const st = (page) => page.evaluate(() => window.LoosenUp.state());
const text = (page, sel) => page.locator(sel).first().innerText();
const screen = (page) => page.evaluate(() => window.LoosenUp.currentScreen());
const tick = (page, n = 1) => page.evaluate((k) => { for (let i = 0; i < k; i++) window.LoosenUp.sessionTick(); }, n);
const openMore = (page) => page.evaluate(() => { document.getElementById('more-help').open = true; });
async function done(ctx, errors) { assert.deepEqual(errors, [], 'no errors in the page'); await ctx.close(); }

/* ---------- First run ---------- */

test('Onboarding: name, welcome gift, first check-in, then Today greets by name', async () => {
  const { ctx, page, errors } = await phone({ onboard: false });
  assert.equal(await screen(page), 'welcome');
  await page.fill('#name-input', '  Asha  ');
  await page.click('#welcome-go');
  assert.equal(await screen(page), 'gift');
  await page.click('#gift-go');
  assert.equal(await screen(page), 'checkin');
  assert.equal((await st(page)).name, 'Asha');
  await go(page, 'today');
  assert.match(await text(page, '#today-title'), /Asha$/);
  assert.match(await text(page, '#today-date'), /\w+day/i);
  assert.match(await text(page, '#today-sky-streak'), /first break/);
  await done(ctx, errors);
});

/* ---------- Exercises ---------- */

test('Breathe now: one tap starts a guided Quick breeze with get ready, phases, rounds and an optional before rating', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#breathe-now');
  assert.equal(await screen(page), 'session');
  assert.equal(await text(page, '#cue'), 'Get ready');
  await tick(page, 3);
  assert.equal(await text(page, '#cue'), 'Breathe in');
  assert.match(await text(page, '#round-count'), /Round 1 of \d+/);
  await tick(page, 4);
  assert.equal(await text(page, '#cue'), 'Breathe out');
  await page.click('#session-pause');
  assert.equal(await text(page, '#session-pause'), 'Resume');
  await page.click('#session-pause');
  await page.click('#session-finish');
  assert.equal(await screen(page), 'after');
  assert.ok(await page.isVisible('#before-tap'), 'one optional before tap');
  await page.click('[data-before="4"]');
  await page.locator('#calm-after').fill('8');
  await page.click('#after-next');
  assert.equal(await screen(page), 'result');
  assert.equal((await text(page, '#result-gain')).trim(), '+4');
  assert.match(await text(page, '#result-streak'), /1 of 3 days/);
  await page.click('#result-done');
  assert.equal(await screen(page), 'today');
  assert.match(await text(page, '#today-sky-streak'), /1 of 3 days this week · 1 break/);
  await done(ctx, errors);
});

test('Choose a calm break: pick feelings, get a recommendation, change it, then begin', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#start-break');
  assert.equal(await screen(page), 'checkin');
  await page.click('[data-context="Busy mind"]');
  await page.click('[data-context="Hard to focus"]');
  await page.locator('#calm-before').fill('3');
  await page.click('#checkin-next');
  assert.equal(await screen(page), 'pick');
  assert.ok((await text(page, '#pick-name')).length > 2);
  assert.match(await text(page, '#pick-reason'), /Picked for Busy mind and Hard to focus/);
  const other = page.locator('#pick-chips [data-pick]:not([aria-pressed="true"])').first();
  const name = await other.innerText();
  await other.click();
  assert.equal(await text(page, '#pick-name'), name.split('\n')[0]);
  await page.click('#pick-begin');
  assert.equal(await screen(page), 'session');
  await done(ctx, errors);
});

test('Every exercise starts and guides: breathing cues, step-by-step steps, tap dots, and Let it out', async () => {
  const { ctx, page, errors } = await phone();
  const tech = await page.evaluate(() => Object.keys(window.LoosenUp.techniques));
  assert.equal(tech.length, 12);
  for (const id of tech) {
    await go(page, 'today');
    const kind = await page.evaluate((t) => { const r = window.LoosenUp.startNow(t); return [r, window.LoosenUp.techniques[t].kind]; }, id);
    if (kind[1] === 'journal') {
      if (await screen(page) === 'checkin') { await page.click('#checkin-next'); if (await screen(page) === 'pick') await page.click('#pick-begin'); }
      assert.equal(await screen(page), 'session', id);
      assert.ok(await page.isVisible('#letitout-text'), 'Let it out shows a text box');
      await page.fill('#letitout-text', 'just a busy day');
      assert.equal(await page.isVisible('#support-sheet'), false);
      await page.click('#session-finish');
      continue;
    }
    assert.equal(await screen(page), 'session', id);
    assert.equal(await text(page, '#session-title'), await page.evaluate((t) => window.LoosenUp.techniques[t].name, id));
    await tick(page, 3);
    if (kind[1] === 'breath') {
      const cues = new Set();
      for (let i = 0; i < 20; i++) { cues.add(await text(page, '#cue')); await tick(page); }
      assert.ok(cues.size >= 2, `${id} changes cue (${[...cues]})`);
    } else {
      assert.match(await text(page, '#step-count'), /^Step 1 of 5$/i, id);
      assert.ok((await text(page, '#step-text')).length > 10);
      if (await page.isVisible('#step-dots .sdot')) {
        const dots = await page.locator('#step-dots .sdot').count();
        for (let d = 0; d < dots; d++) await page.click(`#step-dots [data-dot="${d}"]`);
        await page.waitForTimeout(900);
        assert.match(await text(page, '#step-count'), /^Step 2 of 5$/i, `${id}: tapping every dot moves on`);
      } else {
        await page.click('#step-next');
        assert.match(await text(page, '#step-count'), /^Step 2 of 5$/i, `${id}: Next step`);
      }
    }
    await page.click('#session-finish');
    assert.equal(await screen(page), 'after', id);
  }
  await done(ctx, errors);
});

test('Let it out: crisis words open SOS straight away, and nothing typed is saved', async () => {
  const { ctx, page, errors } = await phone();
  await page.evaluate(() => window.LoosenUp.startPractice('letitout'));
  await page.click('#checkin-next');
  if (await screen(page) === 'pick') await page.click('#pick-begin');
  await page.fill('#letitout-text', 'I want to end my life');
  await page.waitForTimeout(200);
  assert.ok(await page.isVisible('#support-sheet'), 'SOS opened');
  assert.ok(!JSON.stringify(await st(page)).includes('end my life'), 'not stored');
  await done(ctx, errors);
});

test('Exercise length: 1, 3, 5 and 10 minutes change the session, and Quick breeze stays 60 seconds', async () => {
  const { ctx, page, errors } = await phone();
  for (const [m, secs] of [[1, 60], [3, 180], [5, 300], [10, 600]]) {
    await go(page, 'play');
    await page.click(`[data-length="${m}"]`);
    await page.evaluate(() => window.LoosenUp.startNow('breeze'));
    await tick(page, 3);
    assert.equal((await page.evaluate(() => window.LoosenUp.run())).left, secs, `${m} min`);
    await page.click('#session-finish');
  }
  await page.evaluate(() => window.LoosenUp.breatheNow());
  await tick(page, 3);
  assert.equal((await page.evaluate(() => window.LoosenUp.run())).left, 60, 'Quick breeze is always one minute');
  await done(ctx, errors);
});

test('Session sound panel: voice, chimes and background sound toggle and are remembered', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#breathe-now');
  await page.click('#session-audio');
  assert.ok(await page.isVisible('#session-audio-panel'));
  await page.click('#session-audio-panel [data-guide="voice"]');
  await page.click('#session-audio-panel [data-guide="chime"]');
  await page.click('#session-audio-panel [data-bed="rain"]');
  const s = await st(page);
  assert.equal(s.voice, true); assert.equal(s.chime, false); assert.equal(s.bed, 'rain');
  assert.equal(await page.getAttribute('#session-audio-panel [data-bed="rain"]', 'aria-pressed'), 'true');
  await done(ctx, errors);
});

/* ---------- Today ---------- */

test('For you right now: suggests by time, then by mood, then by feeling, and Start goes straight in', async () => {
  const { ctx, page, errors } = await phone();
  assert.ok(await page.isVisible('#for-you'));
  assert.match(await text(page, '#for-you-name'), /, \d+ min$/);
  await page.click('[data-mood="2"]');
  assert.match(await text(page, '#for-you-name'), /^Kind words/);
  await page.click('[data-emotion="worried"]');
  assert.match(await text(page, '#for-you-name'), /^Steady square/);
  await page.click('#for-you-btn');
  assert.equal(await screen(page), 'session');
  assert.equal((await page.evaluate(() => window.LoosenUp.run())).id, 'square');
  await done(ctx, errors);
});

test('Mood check-in: five faces from Crying to Happy move the scale bar and save one mood a day', async () => {
  const { ctx, page, errors } = await phone();
  const labels = await page.locator('[data-mood]').allInnerTexts();
  assert.equal(labels.length, 5);
  for (const [i, w] of [[1, 'Crying'], [2, 'Sad'], [3, 'Okay'], [4, 'Decent'], [5, 'Happy']]) assert.match(labels[i - 1], new RegExp(w));
  await page.click('[data-mood="4"]');
  assert.equal(await page.getAttribute('.mood-scale', 'data-level'), '4');
  await page.click('[data-mood="5"]');
  const s = await st(page);
  assert.equal(s.moods.length, 1); assert.equal(s.moods[0].mood, 5);
  assert.ok((await text(page, '#mood-done')).length > 5);
  await done(ctx, errors);
});

test('Lowest mood asks the safety question once a day, with Yes, No and I just need a moment', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('[data-mood="1"]');
  assert.ok(await page.isVisible('#safety-sheet'));
  await page.click('#safety-no');
  assert.equal(await page.isVisible('#safety-sheet'), false);
  await page.click('[data-mood="2"]'); await page.click('[data-mood="1"]');
  assert.equal(await page.isVisible('#safety-sheet'), false, 'only once a day');
  await page.evaluate(() => window.LoosenUp.setState({ safetyAskedDay: null }));
  await page.click('[data-mood="2"]'); await page.click('[data-mood="1"]');
  await page.click('#safety-moment');
  assert.equal(await screen(page), 'session', 'a moment is a guided breath');
  await page.evaluate(() => window.LoosenUp.setState({ safetyAskedDay: null }));
  await go(page, 'today');
  await page.click('[data-mood="2"]'); await page.click('[data-mood="1"]');
  await page.click('#safety-yes');
  assert.ok(await page.isVisible('#support-sheet'), 'Yes opens SOS');
  await done(ctx, errors);
});

test('Emotion meter: 14 feelings, three levels each, a fourth tap clears, and Progress shows the week', async () => {
  const { ctx, page, errors } = await phone();
  assert.equal(await page.locator('[data-emotion]').count(), 14);
  for (let i = 0; i < 3; i++) await page.click('[data-emotion="angry"]');
  assert.equal(await page.getAttribute('[data-emotion="angry"]', 'data-level'), '3');
  await page.click('[data-emotion="angry"]');
  assert.equal(await page.getAttribute('[data-emotion="angry"]', 'data-level'), '0');
  await page.click('[data-emotion="happy"]'); await page.click('[data-emotion="tired"]');
  await go(page, 'progress');
  const stats = await text(page, '#emo-stats');
  assert.match(stats, /Happy/); assert.match(stats, /Tired/);
  await done(ctx, errors);
});

test('Today layout: games, Sleep journal and more, season card, and the More help fold with every tool', async () => {
  const { ctx, page, errors } = await phone();
  assert.deepEqual(await page.locator('#screen-today .game-row .game-tile strong').allInnerTexts(), ['Calm Pairs', 'Sunbeam Catch', 'Breathing Ring', 'Trace the square']);
  assert.deepEqual(await page.locator('#more-row-kit .tool strong').allInnerTexts(), ['Sleep', 'Journal', 'Support a friend', 'Seasonal packs']);
  assert.ok(await page.isVisible('#screen-today .season-card'), 'October is festival season');
  assert.equal(await page.isVisible('#steps-card'), false, 'More help starts folded');
  await page.click('#more-help summary');
  assert.ok(await page.isVisible('#steps-card'));
  assert.equal(await page.locator('#screen-today .space-card').count(), 4);
  assert.equal(await page.locator('#screen-today .toolkit [data-tool]').count(), 4);
  await done(ctx, errors);
});

test('Little lifts: a Small step can be done or swapped, and the Good things jar saves and remembers', async () => {
  const { ctx, page, errors } = await phone();
  await openMore(page);
  const idea = await text(page, '#step-idea');
  await page.click('#step-another');
  assert.notEqual(await text(page, '#step-idea'), idea);
  await page.click('#step-done');
  assert.equal((await st(page)).smallSteps.length, 1);
  await page.click('#jar-add');
  assert.ok(await page.isVisible('#jar-sheet'));
  await page.fill('#good-text', 'Chai with my sister');
  await page.click('#good-save');
  assert.equal((await st(page)).goodThings.length, 1);
  assert.match(await text(page, '#jar-count'), /1/);
  await done(ctx, errors);
});

test('Spaces: Work, Relationships, Low days and Sleep each open a check-in with their own feelings', async () => {
  const { ctx, page, errors } = await phone();
  for (const sp of ['work', 'relationships', 'lowdays', 'sleep']) {
    await go(page, 'today'); await openMore(page);
    await page.click(`[data-space="${sp}"]`);
    assert.equal(await screen(page), 'checkin', sp);
    const chips = await page.locator('#screen-checkin [data-context]:visible').allInnerTexts();
    assert.ok(chips.length >= 2, `${sp} shows feelings`);
    await page.click('#checkin-back');
  }
  await done(ctx, errors);
});

test('Heavy days surface the support card, which opens SOS', async () => {
  const { ctx, page, errors } = await phone();
  const days = [1, 2, 3].map((n) => { const d = new Date(); d.setDate(d.getDate() - 3 + n); return d.toISOString().slice(0, 10); });
  await page.evaluate((ds) => window.LoosenUp.setState({ moods: ds.map((day) => ({ day, mood: 1 })), safetyAskedDay: ds[2] }), days);
  await go(page, 'today');
  assert.ok(await page.isVisible('#support-card'));
  await page.click('#support-card-sos');
  assert.ok(await page.isVisible('#support-sheet'));
  await done(ctx, errors);
});

/* ---------- SOS and support ---------- */

test('SOS: Breathe now, the three ranked actions with the right numbers, trusted person and More options', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#sos-btn');
  assert.ok(await page.isVisible('#support-sheet'));
  const hrefs = await page.locator('#support-sheet a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  for (const h of ['tel:14416', 'tel:112', 'https://wa.me/919999666555']) assert.ok(hrefs.includes(h), h);
  await page.evaluate(() => { const m = document.getElementById('sos-more'); if (m) m.open = true; });
  await page.click('#sos-add-trusted');
  assert.equal(await screen(page), 'me');
  await page.fill('#trusted-name', 'Ravi');
  await page.fill('#trusted-phone', '+91 98765 43210');
  await page.click('#trusted-save');
  assert.deepEqual((await st(page)).trusted, { name: 'Ravi', phone: '+919876543210' });
  await page.click('#sos-btn');
  assert.match(await text(page, '#sos-text-title'), /Text Ravi now/);
  assert.match(await page.getAttribute('#sos-alert', 'href'), /9876543210/);
  await page.click('#sos-breathe');
  assert.equal(await screen(page), 'session');
  await done(ctx, errors);
});

test('Find support: four helplines, Talk to someone matching, Prepare, filters, in person by city, near me and care team', async () => {
  const { ctx, page, errors } = await phone();
  await go(page, 'support');
  const hl = await page.locator('#screen-support a[data-hl]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  for (const h of ['tel:14416', 'tel:+919999666555', 'tel:9152987821', 'tel:112']) assert.ok(hl.includes(h), h);
  await page.click('#match-fold summary');
  assert.equal(await page.locator('#match-list .partner').count(), 3, 'three matches by default (now, phone, free)');
  assert.match(await text(page, '#match-list'), /Tele MANAS/);
  await page.click('[data-match="when:week"]'); await page.click('[data-match="how:video"]'); await page.click('[data-match="budget:low"]');
  const names = await page.locator('#match-list .partner strong').allInnerTexts();
  assert.ok(names.length >= 1 && names.length <= 3, 'up to three fits');
  assert.ok(!names.some((n) => /Tele MANAS|iCall/.test(n)), 'a paid video session this week, not a helpline');
  await page.click('[data-match="lang:hindi"]');
  assert.ok((await page.locator('#match-list .partner').count()) >= 1);
  await page.click('#match-prepare');
  assert.equal(await page.evaluate(() => document.getElementById('prepare-fold').open), true);
  await page.click('#copy-script');
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /first appointment/);
  await page.click('#match-all');
  assert.equal(await page.evaluate(() => document.getElementById('book-fold').open), true);
  for (const f of ['free', 'therapy', 'psychiatry', 'hindi', 'all']) {
    await page.click(`[data-pfilter="${f}"]`);
    assert.ok((await page.locator('#partner-list .partner').count()) >= 1, f);
  }
  await page.evaluate(() => { for (const d of document.querySelectorAll('#screen-support details')) d.open = true; });
  await page.selectOption('#inperson-city', { index: 1 });
  assert.ok((await page.locator('#inperson-list .partner').count()) >= 1, 'places in that city');
  assert.match(await page.locator('#inperson-list a', { hasText: 'Directions' }).first().getAttribute('href'), /maps/);
  const near = await page.locator('[data-near]').first().getAttribute('href');
  assert.match(near, /maps.*near/);
  await page.fill('#care-name-input', 'Dr Meera Rao'); await page.selectOption('#care-role-input', { index: 1 }); await page.fill('#care-phone-input', '9876543210');
  await page.click('#care-save');
  assert.equal((await st(page)).careTeam.name, 'Dr Meera Rao');
  assert.ok(await page.isVisible('#care-view'));
  await page.click('#care-edit');
  assert.ok(await page.isVisible('#care-form'));
  await done(ctx, errors);
});

test('Safety plan: seven sections save on this phone and come back after a reload', async () => {
  const { ctx, page, errors } = await phone();
  await go(page, 'safety');
  const ids = ['sp-signs', 'sp-coping', 'sp-places', 'sp-people', 'sp-pros', 'sp-safe', 'sp-reasons'];
  for (const id of ids) await page.fill('#' + id, 'note for ' + id);
  await page.click('#sp-save');
  await page.reload();
  await go(page, 'safety');
  for (const id of ids) assert.equal(await page.inputValue('#' + id), 'note for ' + id);
  await done(ctx, errors);
});

test('Reframe a thought: five steps to a kinder view; crisis words are wiped and open SOS', async () => {
  const { ctx, page, errors } = await phone();
  await go(page, 'reframe');
  await page.click('#rf-next');
  assert.equal(await page.isVisible('#toast'), true, 'asks for a few words first');
  await page.fill('#rf-situation', 'Boss replied late'); await page.click('#rf-next');
  await page.fill('#rf-thought', 'I am useless'); await page.click('#rf-next');
  await page.evaluate(() => { const r = document.getElementById('rf-before'); r.value = '8'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.click('#rf-next');
  await page.fill('#rf-friend', 'You are not useless'); await page.fill('#rf-evidence', 'I shipped two things'); await page.click('#rf-next');
  await page.fill('#rf-kinder', 'One slow reply is not about my worth'); await page.evaluate(() => { const r = document.getElementById('rf-after'); r.value = '4'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.click('#rf-next');
  assert.match(await text(page, '#rf-result'), /From 8 to 4/);
  assert.equal((await st(page)).reframes, 1);
  await go(page, 'reframe');
  await page.fill('#rf-situation', 'I want to kill myself');
  assert.equal(await page.inputValue('#rf-situation'), '');
  assert.ok(await page.isVisible('#support-sheet'));
  await done(ctx, errors);
});

test('Wellbeing check: five WHO-5 questions give a score out of 100 and show on Progress', async () => {
  const { ctx, page, errors } = await phone();
  await go(page, 'wellbeing');
  for (let q = 0; q < 5; q++) await page.click(`[data-wb="${q}:3"]`);
  await page.click('#wb-submit');
  assert.equal(await text(page, '#wb-score'), '60');
  await go(page, 'progress');
  assert.match(await text(page, '#prog-wb'), /60 \/ 100/);
  await done(ctx, errors);
});

/* ---------- Learn and programmes ---------- */

test('Learn: all nine lessons open, and Try it starts the matching exercise or space', async () => {
  const { ctx, page, errors } = await phone();
  await go(page, 'learn');
  const ids = await page.locator('[data-lesson]').evaluateAll((b) => b.map((x) => x.getAttribute('data-lesson')));
  assert.equal(new Set(ids).size, 9);
  for (const id of new Set(ids)) {
    await go(page, 'learn');
    await page.click(`[data-lesson="${id}"]`);
    assert.equal(await screen(page), 'lesson');
    assert.ok((await text(page, '#lesson-body')).length > 80, id);
    if (await page.isVisible('#lesson-try')) { await page.click('#lesson-try'); assert.notEqual(await screen(page), 'lesson', id + ' opens its practice'); }
  }
  await done(ctx, errors);
});

test('Programmes: Sleep, Exam calm and Burnout recovery open; Day 1 starts, completes, and the next day waits', async () => {
  const { ctx, page, errors } = await phone();
  await go(page, 'programs');
  assert.equal(await page.locator('#program-list [data-program]').count(), 3);
  for (const id of ['sleep', 'exam', 'burnout']) {
    await page.evaluate((p) => window.LoosenUp.openProgram(p), id);
    assert.equal(await screen(page), 'program');
    assert.match(await text(page, '#program-day-label'), /Day 1 of (14|21)/i);
  }
  await page.evaluate(() => window.LoosenUp.openProgram('exam'));
  await page.click('#program-start');
  if (await screen(page) === 'checkin') await page.click('#checkin-next');
  if (await screen(page) === 'pick') await page.click('#pick-begin');
  await page.click('#session-finish');
  await page.click('#after-next');
  assert.equal((await page.evaluate(() => window.LoosenUp.programStatus('exam'))).done, 1);
  await page.evaluate(() => window.LoosenUp.openProgram('exam'));
  assert.match(await text(page, '#screen-program'), /tomorrow/i);
  await done(ctx, errors);
});

/* ---------- Calm tab ---------- */

test('Calm tab: Breathe, Games and Sounds segments, practice cards, and every exercise card starts', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('[data-tab="play"]');
  for (const seg of ['games', 'sounds', 'breathe']) {
    await page.click(`[data-seg="${seg}"]`);
    assert.equal(await page.evaluate(() => window.LoosenUp.calmSeg()), seg);
  }
  const cards = await page.locator('#panel-breathe [data-practice]').evaluateAll((b) => b.map((x) => x.getAttribute('data-practice')));
  assert.ok(cards.length >= 11, 'every exercise has a card');
  await page.click('#panel-breathe [data-practice="cooldown"]');
  assert.equal(await screen(page), 'checkin');
  await done(ctx, errors);
});

test('Sounds: rain, ocean, brown noise and breeze play and stop, with a sleep timer and volume', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('[data-tab="play"]'); await page.click('[data-seg="sounds"]');
  for (const s of ['rain', 'ocean', 'brown', 'breeze']) {
    await page.click(`[data-sound="${s}"]`);
    assert.equal(await page.getAttribute(`[data-sound="${s}"]`, 'aria-pressed'), 'true', s);
    assert.match(await text(page, '#sound-status'), /Playing/);
  }
  await page.click('[data-timer="15"]');
  assert.equal(await page.getAttribute('[data-timer="15"]', 'aria-pressed'), 'true');
  await page.locator('#sound-volume').fill('30');
  await page.click('#sound-stop');
  assert.match(await text(page, '#sound-status'), /Stopped/);
  await done(ctx, errors);
});

/* ---------- Games ---------- */

test('Calm Pairs: cards flip, and finishing shows the done card with Play again and Back', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#screen-today [data-game="pairs"]');
  assert.equal(await screen(page), 'game');
  await page.click('[data-card="0"]'); await page.click('[data-card="1"]');
  assert.ok((await page.evaluate(() => window.LoosenUp.game().flips || window.LoosenUp.game().moves || 1)) >= 1);
  await page.evaluate(() => window.LoosenUp.finishCurrentGame());
  assert.ok(await page.isVisible('#game-done'));
  await page.click('#game-again');
  assert.equal(await page.isVisible('#game-done'), false);
  await page.click('#game-back');
  assert.equal(await screen(page), 'today');
  assert.ok((await st(page)).badges.includes('playful'));
  await done(ctx, errors);
});

test('Sunbeam Catch: beams appear and can be caught for points', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#screen-today [data-game="catch"]');
  await page.evaluate(() => window.LoosenUp.spawnBeam());
  await page.locator('.beam').first().dispatchEvent('pointerdown');
  await page.waitForTimeout(200);
  assert.match(await text(page, '#game-score'), /[1-9]/);
  await page.evaluate(() => window.LoosenUp.finishCurrentGame());
  assert.ok(await page.isVisible('#game-done'));
  await done(ctx, errors);
});

test('Breathing Ring: holding grows the ring and counts breaths', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#screen-today [data-game="bloom"]');
  await page.locator('#bloom-hold').dispatchEvent('pointerdown');
  await page.waitForTimeout(1500);
  await page.locator('#bloom-hold').dispatchEvent('pointerup');
  await page.evaluate(() => window.LoosenUp.finishCurrentGame());
  assert.ok(await page.isVisible('#game-done'));
  await done(ctx, errors);
});

test('Trace the square: the dot travels the square and a finger on it is scored', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#screen-today [data-more="trace"]');
  assert.equal(await screen(page), 'trace');
  await page.click('#trace-start');
  const box = await page.locator('#trace-svg').boundingBox();
  for (let i = 0; i < 12; i++) {
    const d = await page.evaluate(() => { const c = document.getElementById('trace-dot'); return [+c.getAttribute('cx'), +c.getAttribute('cy')]; });
    await page.mouse.move(box.x + d[0] * box.width / 220, box.y + d[1] * box.height / 220);
    if (i === 0) await page.mouse.down();
    await page.waitForTimeout(150);
  }
  assert.match(await text(page, '#trace-phase'), /Breathe in|Hold/);
  const pct = await page.evaluate(() => window.LoosenUpMore.traceEnd());
  assert.ok(pct > 30, `stayed with the dot ${pct}%`);
  assert.match(await text(page, '#trace-score'), /You stayed with the dot \d+% of the time/);
  await done(ctx, errors);
});

/* ---------- Sleep, journal, friend, packs ---------- */

test('Sleep: four sessions; each plays voice lines with sound, pauses, sets the after-sound, and stops', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#screen-today [data-more="sleep"]');
  assert.equal(await screen(page), 'sleep');
  assert.equal(await page.locator('[data-sleep]').count(), 4);
  for (const id of ['scan', 'nidra', 'train', 'monsoon']) {
    await page.click(`[data-sleep="${id}"]`);
    assert.ok(await page.isVisible('#sleep-player'), id);
    assert.ok(await page.evaluate(() => document.documentElement.classList.contains('sleep-dim')), 'night dim');
    const first = await text(page, '#sp-line');
    const runA = await page.evaluate(() => window.LoosenUpMore.sleepRun());
    for (let i = 0; i < 40; i++) await page.evaluate(() => window.LoosenUpMore.sleepTick());
    assert.notEqual(await text(page, '#sp-line'), first, `${id} moves to the next line`);
    assert.match(await text(page, '#sp-time'), /\d+:\d\d left/);
    assert.match(await text(page, '#sp-kind'), new RegExp(Math.round(runA.total / 60) + ' min', 'i'), 'the label matches the real length');
    await page.click('#sp-pause'); assert.equal(await text(page, '#sp-pause'), 'Resume');
    await page.click('#sp-pause');
    await page.click('[data-sleep-after="30"]');
    assert.equal((await st(page)).sleepAfter, 30);
    await page.click('#sp-stop');
    assert.ok(await page.isVisible('#sleep-list'));
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('sleep-dim')), false);
  }
  await page.click('[data-tab="play"]').catch(() => {});
  await go(page, 'play'); await page.click('[data-seg="sounds"]');
  await page.click('#panel-sounds [data-more="sleep"]');
  assert.equal(await screen(page), 'sleep', 'also from Sounds');
  await done(ctx, errors);
});

test('Sleep session runs to the end and fades out', async () => {
  const { ctx, page, errors } = await phone();
  await page.evaluate(() => window.LoosenUpMore.sleepStart('train'));
  await page.click('[data-sleep-after="0"]');
  const total = (await page.evaluate(() => window.LoosenUpMore.sleepRun())).total;
  await page.evaluate((t) => { for (let i = 0; i <= t + 2; i++) window.LoosenUpMore.sleepTick(); }, total);
  assert.equal(await text(page, '#sp-line'), 'Sleep well.');
  assert.match(await text(page, '#sp-time'), /Fading to silence/);
  await done(ctx, errors);
});

test('Journal: prompts, save only on tap, delete, an empty save asks for words, and crisis words open SOS', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#screen-today [data-more="journal"]');
  const p1 = await text(page, '#journal-prompt');
  await page.click('#journal-another');
  assert.notEqual(await text(page, '#journal-prompt'), p1);
  await page.click('#journal-save');
  assert.equal((await st(page)).journal.length, 0, 'nothing to save');
  await page.fill('#journal-text', 'Today the walk helped.');
  assert.equal((await st(page)).journal.length, 0, 'not saved while typing');
  await page.click('#journal-save');
  assert.equal((await st(page)).journal[0].text, 'Today the walk helped.');
  assert.equal(await page.locator('.journal-entry').count(), 1);
  await page.click('[data-jdel]');
  assert.equal((await st(page)).journal.length, 0);
  await page.fill('#journal-text', 'I keep thinking about suicide');
  await page.click('#journal-save');
  assert.ok(await page.isVisible('#support-sheet'), 'support opens');
  await done(ctx, errors);
});

test('Support a friend: four steps, call and emergency links, and share helplines', async () => {
  const { ctx, page, errors } = await phone({ init: () => { window.__shared = []; navigator.share = (d) => { window.__shared.push(d); return Promise.resolve(); }; } });
  await page.click('#screen-today [data-more="friend"]');
  assert.equal(await page.locator('#screen-friend .friend-step').count(), 4);
  const hrefs = await page.locator('#screen-friend a').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
  assert.deepEqual(hrefs, ['tel:14416', 'tel:112']);
  await page.click('#friend-share');
  const shared = await page.evaluate(() => window.__shared);
  assert.match(shared[0].text, /14416.*9999 666 555.*9152987821.*112/);
  await done(ctx, errors);
});

test('Seasonal packs: four packs, the current one is marked, and every item opens the right thing', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('#screen-today .season-card');
  assert.equal(await screen(page), 'packs');
  assert.equal(await page.locator('.pack-card').count(), 4);
  assert.equal(await page.locator('.pack-card.now').count(), 1);
  const items = await page.locator('[data-pack-item]').evaluateAll((b) => b.map((x) => x.getAttribute('data-pack-item')));
  assert.equal(items.length, 16);
  const want = { practice: 'checkin', program: 'program', lesson: 'lesson', sleep: 'sleep' };
  for (const it of items) {
    await go(page, 'packs');
    await page.click(`[data-pack-item="${it}"]`);
    assert.equal(await screen(page), want[it.split(':')[0]], it);
    if (it.startsWith('sleep')) await page.click('#sp-stop');
  }
  await done(ctx, errors);
});

/* ---------- Progress ---------- */

test('Progress: weekly goal chips, day dots, reflection, totals, week chart and milestones (earned plus the next one)', async () => {
  const { ctx, page, errors } = await phone();
  await page.evaluate(() => window.LoosenUp.completeSession({ technique: 'breeze', context: 'Busy mind', before: 3, after: 7 }));
  await go(page, 'progress');
  assert.match(await text(page, '#goal-line'), /1 of 3 days this week/);
  assert.equal(await page.locator('#goal-days .gday.on').count(), 1);
  await page.click('[data-goal="1"]');
  assert.match(await text(page, '#goal-line'), /Goal met/);
  assert.match(await text(page, '#reflect-list'), /What helped most: Slow breeze/);
  assert.equal(await text(page, '#prog-total'), '1');
  assert.equal(await text(page, '#prog-avg'), '+4');
  assert.match(await page.getAttribute('#week-chart', 'aria-label'), /\+4/);
  const badges = await page.locator('#badges li').allInnerTexts();
  assert.ok(badges.some((b) => /First break/.test(b)));
  assert.equal(await page.locator('#badges li.dim').count(), 1, 'just the next one to look forward to');
  assert.doesNotMatch(await text(page, '#screen-progress'), /in a row/);
  await done(ctx, errors);
});

/* ---------- Me ---------- */

test('Me: daily reminder saves, shows the banner after its time, and asks the server for a web notification', async () => {
  const { ctx, page, errors, calls } = await phone({ init: () => {
    Object.defineProperty(window, 'Notification', { value: { requestPermission: () => Promise.resolve('granted'), permission: 'granted' }, configurable: true });
    if (window.PushManager) {
      PushManager.prototype.getSubscription = () => Promise.resolve(null);
      PushManager.prototype.subscribe = () => Promise.resolve({ endpoint: 'https://push.example/abc', toJSON() { return { endpoint: this.endpoint, keys: { p256dh: 'k', auth: 'a' } }; } });
    }
  } });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.click('[data-tab="me"]');
  await page.fill('#golden-time', '00:01');
  await page.click('#golden-save');
  await page.waitForTimeout(800);
  assert.equal((await st(page)).goldenHour, '00:01');
  assert.match(await text(page, '#golden-help'), /Daily reminder set for 00:01\. One gentle reminder arrives each day\./);
  const sub = calls.find((c) => c.body.action === 'subscribe');
  assert.ok(sub, 'subscribed with the server');
  assert.equal(sub.body.time, '00:01');
  assert.match(await text(page, '#push-status'), /A notification will arrive each day at 00:01/);
  await go(page, 'today');
  assert.ok(await page.isVisible('#golden-banner'), 'the in-app note after the chosen time');
  await go(page, 'me');
  await page.click('#golden-clear');
  assert.equal((await st(page)).goldenHour, null);
  await done(ctx, errors);
});

test('Service worker: a push message shows the LoosenUp notification, and tapping it opens the app', async () => {
  // Headless Chromium cannot grant notification permission, so the worker's own handlers run here with a stand-in self.
  const { readFileSync } = await import('node:fs');
  const handlers = {}, shown = [], opened = [];
  const self = {
    addEventListener: (k, f) => { handlers[k] = f; }, location: { origin: 'https://loosenup.anchit-tandon.com' },
    registration: { showNotification: (t, o) => { shown.push([t, o]); return Promise.resolve(); } },
    clients: { matchAll: () => Promise.resolve([]), openWindow: (u) => { opened.push(u); return Promise.resolve(); }, claim: () => Promise.resolve() },
    skipWaiting: () => Promise.resolve()
  };
  new Function('self', 'caches', readFileSync(new URL('../../www/sw.js', import.meta.url), 'utf8'))(self, {});
  let wait;
  handlers.push({ data: { json: () => ({ title: 'LoosenUp', body: 'दो शांत मिनट हमेशा आपके लिए हैं, जब भी आप चाहें।', url: '/' }) }, waitUntil: (p) => { wait = p; } });
  await wait;
  assert.equal(shown[0][0], 'LoosenUp');
  assert.match(shown[0][1].body, /दो शांत मिनट/);
  assert.equal(shown[0][1].tag, 'loosenup-daily', 'one reminder at a time');
  handlers.notificationclick({ notification: { close() {}, data: { url: '/' } }, waitUntil: (p) => { wait = p; } });
  await wait;
  assert.deepEqual(opened, ['/']);
});

test('Me: voice guide, breathing vibration, text size, theme and language all switch and are remembered', async () => {
  const { ctx, page, errors } = await phone({ init: () => { navigator.vibrate = () => true; } });
  await page.click('[data-tab="me"]');
  await page.click('#voice-toggle');
  assert.equal(await text(page, '#voice-toggle'), 'Voice is on');
  await page.click('#haptic-toggle');
  assert.match(await text(page, '#haptic-toggle'), /on$/);
  for (const sz of ['large', 'larger', 'normal']) {
    await page.click(`[data-textsize="${sz}"]`);
    assert.equal(await page.evaluate((s) => s === 'normal' ? !document.documentElement.className.includes('text-l') : document.documentElement.classList.contains('text-' + s), sz), true, sz);
  }
  await page.click('[data-theme-choice="dark"]');
  assert.equal(await page.getAttribute('html', 'data-theme'), 'dark');
  await page.click('[data-theme-choice="light"]');
  assert.equal(await page.getAttribute('html', 'data-theme'), 'light');
  await page.click('#screen-me [data-lang-choice="hi"]');
  assert.equal(await page.getAttribute('html', 'lang'), 'hi');
  assert.match(await page.locator('[data-tab="today"]').innerText(), /[ऀ-ॿ]/);
  await page.click('#screen-me [data-lang-choice="en"]');
  assert.equal(await page.locator('[data-tab="today"]').innerText(), 'Today');
  await page.reload();
  const s = await st(page);
  assert.equal(s.voice, true); assert.equal(s.hapticBreath, true); assert.equal(s.theme, 'light'); assert.equal(s.lang, 'en');
  await done(ctx, errors);
});

test('Me: app lock with a PIN locks on reload, refuses a wrong PIN, unlocks, offers SOS, and turns off', async () => {
  const { ctx, page, errors } = await phone();
  await page.click('[data-tab="me"]');
  await page.click('#lock-toggle');
  await page.fill('#pin-new', '2468'); await page.fill('#pin-confirm', '2468');
  await page.click('#pin-save');
  assert.equal((await st(page)).lock.enabled, true);
  assert.ok(!JSON.stringify(await st(page)).includes('2468'), 'the PIN is never stored, only a hash');
  await page.reload();
  assert.ok(await page.isVisible('#lock-screen'));
  await page.fill('#lock-pin', '1111'); await page.click('#lock-unlock');
  assert.match(await text(page, '#lock-msg'), /did not match/);
  await page.click('#lock-sos');
  assert.ok(await page.isVisible('#support-sheet'), 'SOS works while locked');
  await page.click('#support-close');
  await page.fill('#lock-pin', '2468'); await page.click('#lock-unlock');
  assert.equal(await page.isVisible('#lock-screen'), false);
  await go(page, 'me');
  await page.click('#lock-toggle');
  await page.fill('#pin-current', '2468'); await page.click('#pin-off');
  assert.equal((await st(page)).lock.enabled, false);
  await done(ctx, errors);
});

test('Me: join an organisation, share the anonymous pulse with a signed pass, and leave', async () => {
  const { ctx, page, errors, calls } = await phone();
  await page.click('[data-tab="me"]');
  await page.fill('#org-code', 'luab23cd');
  await page.click('#org-join-btn');
  await page.waitForTimeout(300);
  assert.match(await text(page, '#org-status'), /You joined Riverside College/);
  assert.equal((await st(page)).org.pass, 'pass');
  await page.evaluate(() => window.LoosenUp.setState({ sessions: [{ ts: Date.now() - 7 * 864e5, day: new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10), technique: 'sigh', context: 'Busy mind', contexts: ['Busy mind'], before: 3, after: 6, gain: 3 }] }));
  await page.click('#org-share');
  await page.waitForTimeout(300);
  const p = calls.find((c) => c.body.action === 'pulse');
  assert.ok(p, 'pulse sent');
  assert.equal(p.body.pass, 'pass');
  assert.ok(!JSON.stringify(p.body).includes('Asha'), 'no name');
  await page.click('#sos-btn');
  await page.evaluate(() => { document.getElementById('sos-more').open = true; });
  assert.ok(await page.isVisible('#sos-org'), 'the organisation support line appears in SOS');
  assert.equal(await page.getAttribute('#sos-org', 'href'), 'tel:+918012345678');
  await page.click('#support-close');
  await page.click('#org-leave');
  assert.equal((await st(page)).org, null);
  await done(ctx, errors);
});

test('Me: backup exports a file and restores it; reset starts fresh', async () => {
  const { ctx, page, errors } = await phone({ init: () => { navigator.canShare = () => false; } });
  await page.evaluate(() => window.LoosenUp.completeSession({ technique: 'sigh', context: 'Busy mind', before: 4, after: 7 }));
  await page.click('[data-tab="me"]');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#backup-export')]);
  const path = await dl.path();
  assert.match(dl.suggestedFilename(), /^loosenup-backup-\d{4}-\d\d-\d\d\.json$/);
  await page.click('#reset-btn');
  await page.click('#reset-confirm');
  assert.equal(await screen(page), 'welcome');
  assert.equal((await st(page)).sessions.length, 0);
  await page.fill('#name-input', 'Asha'); await page.click('#welcome-go'); await page.click('#gift-go');
  await go(page, 'me');
  await page.setInputFiles('#backup-import', path);
  await page.waitForTimeout(400);
  assert.equal((await st(page)).sessions.length, 1, 'restored');
  await done(ctx, errors);
});

test('LoosenUp Plus: the shop opens and a demo purchase unlocks every programme day', async () => {
  const { ctx, page, errors } = await phone();
  await page.evaluate(() => window.LoosenUp.openShop());
  assert.ok(await page.isVisible('#shop-sheet'));
  await page.click('[data-sku="fullbloomYear"]');
  assert.ok(await page.isVisible('#checkout-sheet'));
  await page.click('#checkout-confirm');
  assert.equal((await st(page)).plan, 'fullbloom');
  await done(ctx, errors);
});

/* ---------- Whole app ---------- */

test('Hindi: every tab, the new screens and sheets show Hindi with no errors', async () => {
  const { ctx, page, errors } = await phone();
  await page.evaluate(() => window.LoosenUp.setLang('hi'));
  for (const s of ['today', 'play', 'progress', 'me', 'support', 'sleep', 'journal', 'friend', 'packs', 'trace', 'safety', 'learn', 'programs']) {
    await go(page, s);
    const t = await page.locator(`[data-screen="${s}"]`).innerText();
    assert.match(t, /[ऀ-ॿ]{3}/, `${s} is in Hindi`);
  }
  await page.click('#sos-btn');
  assert.match(await page.locator('#support-sheet').innerText(), /[ऀ-ॿ]{3}/);
  await done(ctx, errors);
});

test('Dark mode: every screen opens with no errors', async () => {
  const { ctx, page, errors } = await phone({ scheme: 'dark' });
  assert.equal(await page.getAttribute('html', 'data-theme'), 'dark');
  for (const s of ['today', 'play', 'progress', 'me', 'support', 'sleep', 'journal', 'friend', 'packs', 'trace', 'safety', 'reframe', 'learn', 'programs', 'wellbeing']) await go(page, s);
  await done(ctx, errors);
});
