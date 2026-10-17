/* Brightside - 2-minute guided calm breaks. Data stays on this device (localStorage). */
(function () {
  'use strict';

  var VERSION = '1.0.0';
  var KEY = 'brightside.v1';
  var PUBLIC_URL = 'https://brightside-calm.vercel.app';
  var WEEKLY_FREE_SEEDS = 2;
  var DAILY_NUDGES = 2;
  var MILESTONES = [3, 7, 21, 30];

  var TEST = window.__BRIGHTSIDE_TEST__ || {};
  var nowOverride = TEST.now ? new Date(TEST.now) : null;
  var rng = TEST.rng || Math.random;
  function now() { return nowOverride ? new Date(nowOverride.getTime()) : new Date(); }

  /* ---------- Content ---------- */

  var TECH = {
    sigh: {
      id: 'sigh', name: 'Sigh of relief', seconds: 120, unlockAt: 0, color: '#FFB088', kind: 'breath',
      desc: 'Two easy breaths in through the nose, then one long, slow breath out.',
      pattern: [['Breathe in', 2, 1], ['A little more', 1, 1.08], ['Long breath out', 6, 0.6]]
    },
    breeze: {
      id: 'breeze', name: 'Slow breeze', seconds: 120, unlockAt: 0, color: '#8CC8F0', kind: 'breath',
      desc: 'Soft, even breathing. In for five, out for five, like a slow breeze.',
      pattern: [['Breathe in', 5, 1], ['Breathe out', 5, 0.6]]
    },
    here: {
      id: 'here', name: 'Here and now', seconds: 120, unlockAt: 0, color: '#4FA67C', kind: 'steps',
      desc: 'Gently notice the world around you, one sense at a time.',
      steps: ['Look around and name 5 things you can see.', 'Notice 4 things you can feel, like your feet or your sleeves.',
        'Listen for 3 sounds, near or far.', 'Find 2 things you can smell, or 2 favourite scents.', 'Notice 1 taste, or take a sip of water.']
    },
    release: {
      id: 'release', name: 'Soft release', seconds: 120, unlockAt: 3, color: '#C9A7F2', kind: 'steps',
      desc: 'Tense each area for a breath, then let it go soft, from shoulders to toes.',
      steps: ['Lift your shoulders up to your ears. Hold. Let them drop.', 'Make two fists. Squeeze. Open your hands wide and soft.',
        'Scrunch your face. Then let your jaw hang loose.', 'Press your feet into the floor. Then let them rest.', 'Take one long breath and feel your whole body settle.']
    },
    letitout: {
      id: 'letitout', name: 'Let it out', seconds: 120, unlockAt: 5, color: '#FFC857', kind: 'journal',
      desc: 'Two minutes to type whatever is on your mind. Nothing is saved.'
    },
    quick: {
      id: 'quick', name: 'Quick breeze', seconds: 60, unlockAt: 0, color: '#CFE8FF', kind: 'breath', free: true,
      desc: 'Sixty seconds of slow, easy breathing. Always free.',
      pattern: [['Breathe in', 4, 1], ['Breathe out', 6, 0.6]]
    }
  };
  var CHOOSABLE = ['sigh', 'breeze', 'here', 'release', 'letitout'];

  var CONTEXTS = ['Busy mind', 'Tight shoulders', 'Big moment ahead', 'Hard to focus', 'Winding down', 'Just a quick lift'];
  var RULES = {
    'Busy mind': [['letitout', 'Putting thoughts into words can make a busy mind feel roomier.'],
      ['here', 'Noticing what is around you gently brings a busy mind back to now.']],
    'Tight shoulders': [['release', 'Tensing and softening helps shoulders let go.'],
      ['sigh', 'A long breath out is a quick way to soften tight shoulders.']],
    'Big moment ahead': [['sigh', 'A couple of long breaths out can help you feel steady before a big moment.']],
    'Hard to focus': [['breeze', 'Slow, even breathing gives your attention a calm rhythm to follow.']],
    'Winding down': [['release', 'Letting each muscle go soft is a lovely way to wind down.'],
      ['breeze', 'Slow breathing is a gentle way to wind down.']],
    'Just a quick lift': [['sigh', 'A Sigh of relief is the quickest lift we know.']]
  };

  var LEVELS = [['Seedling', 0], ['Sprout', 50], ['Bud', 150], ['Bloom', 300], ['Full Bloom', 500], ['Meadow', 800]];

  var BADGES = {
    first: ['First light', 'Your first break'],
    streak3: ['3 Sunny days', 'Three days in a row'],
    streak7: ['Sunny week', 'Seven days in a row'],
    streak21: ['21 Sunny days', 'A habit in full bloom'],
    streak30: ['30 Sunny days', 'A whole month of light'],
    ten: ['Ten breaks', 'Ten calm moments'],
    bigLift: ['Big lift', 'A Calm gain of +5 or more'],
    explorer: ['Explorer', 'Tried every technique'],
    sunbeam: ['Sunbeam', 'Caught a Sunbeam surprise'],
    sharer: ['Sunbeam sharer', 'Shared Brightside'],
    golden: ['Golden hour', 'Set a daily time']
  };

  var NOTES = [
    'Two minutes for you is never small.',
    'Your calm is a skill, and you just practised it.',
    'However today goes, you made a little room for yourself.',
    'Small breaks, bright days.',
    'You gave your mind a soft place to land.',
    'Every break plants something good.'
  ];

  var SKUS = {
    fullbloom: { name: 'Full Bloom, monthly', price: '₹299/mo or USD 6.99/mo' },
    seeds10: { name: '10 Seeds', price: '₹99 or USD 1.99', seeds: 10 },
    seeds30: { name: '30 Seeds', price: '₹249 or USD 4.99', seeds: 30 },
    seeds100: { name: '100 Seeds', price: '₹699 or USD 12.99', seeds: 100 }
  };

  var CRISIS = [
    /suicid/i, /\bkill(ing)?\s+my\s*self\b/i, /\bend(ing)?\s+it\s+all\b/i, /\bend(ing)?\s+my\s+life\b/i,
    /\bself[\s-]?harm/i, /\bwant(ed)?\s+to\s+die\b/i, /\bwanna\s+die\b/i, /\bhurt(ing)?\s+my\s*self\b/i,
    /\bharm(ing)?\s+my\s*self\b/i, /\bno\s+reason\s+to\s+live\b/i, /\bbetter\s+off\s+dead\b/i,
    /\b(do\s*n[o']?t|dont)\s+want\s+to\s+(live|be\s+alive|be\s+here)\b/i, /\btake\s+my\s+(own\s+)?life\b/i,
    /\bnot\s+worth\s+living\b/i, /\bcut(ting)?\s+my\s*self\b/i
  ];
  function isCrisis(text) {
    var t = String(text || '');
    for (var i = 0; i < CRISIS.length; i++) if (CRISIS[i].test(t)) return true;
    return false;
  }

  /* ---------- Dates ---------- */

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayKey(d) { d = new Date(d); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dayNum(key) { var p = key.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000; }
  function daysBetween(a, b) { return dayNum(b) - dayNum(a); }
  function weekKey(d) {
    d = new Date(d);
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var wd = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - wd);
    var y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    var wk = Math.ceil(((t - y0) / 86400000 + 1) / 7);
    return t.getUTCFullYear() + '-W' + pad(wk);
  }
  function bucketOf(ts) {
    var h = new Date(ts).getHours();
    if (h >= 5 && h < 12) return 'Mornings';
    if (h >= 12 && h < 17) return 'Afternoons';
    if (h >= 17 && h < 22) return 'Evenings';
    return 'Quiet nights';
  }

  /* ---------- State ---------- */

  function freshState() {
    return {
      v: 1, name: '', createdAt: null, onboarded: false, seeds: 0, xp: 0, plan: 'free',
      sessions: [], streak: { count: 0, lastDay: null, best: 0 }, rainDayWeek: null,
      rewardSeeds: { week: null, count: 0 }, milestones: [], sunbeamDay: null, referralDay: null,
      nudges: { day: null, count: 0, shown: [] }, goldenHour: null, voice: false, badges: [], purchases: []
    };
  }
  function load() {
    var s = freshState();
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) {
        var p = JSON.parse(raw);
        for (var k in p) if (Object.prototype.hasOwnProperty.call(s, k)) s[k] = p[k];
      }
    } catch (e) { /* storage unavailable: start fresh in memory */ }
    return s;
  }
  var state = load();
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  /* ---------- Engine ---------- */

  function level(xp) {
    xp = xp == null ? state.xp : xp;
    var i = 0;
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][1]) i++;
    var lo = LEVELS[i][1];
    var next = LEVELS[i + 1];
    var pct = next ? Math.max(0, Math.min(100, Math.round((xp - lo) / (next[1] - lo) * 100))) : 100;
    return { index: i, name: LEVELS[i][0], percent: pct, next: next ? next[0] : null, toNext: next ? next[1] - xp : 0 };
  }

  function breaksDone() { return state.sessions.length; }
  function isUnlocked(id) { return breaksDone() >= (TECH[id] ? TECH[id].unlockAt : 0); }

  function recommend(context) {
    var ctx = RULES[context] ? context : 'Just a quick lift';
    var stats = {};
    state.sessions.forEach(function (s) {
      if (s.context !== ctx || !TECH[s.technique] || s.technique === 'quick') return;
      var st = stats[s.technique] || (stats[s.technique] = { n: 0, sum: 0 });
      st.n++; st.sum += s.gain;
    });
    var best = null;
    CHOOSABLE.forEach(function (id) {
      var st = stats[id];
      if (!st || st.n < 2 || !isUnlocked(id)) return;
      var avg = st.sum / st.n;
      if (!best || avg > best.avg) best = { id: id, avg: avg };
    });
    if (best) {
      var a = (best.avg >= 0 ? '+' : '') + best.avg.toFixed(1);
      return { id: best.id, name: TECH[best.id].name, learned: true,
        reason: 'Picked from your own breaks: ' + TECH[best.id].name + ' averages ' + a + ' Calm gain for "' + ctx + '".' };
    }
    var rules = RULES[ctx];
    for (var i = 0; i < rules.length; i++) {
      if (isUnlocked(rules[i][0])) return { id: rules[i][0], name: TECH[rules[i][0]].name, reason: rules[i][1], learned: false };
    }
    return { id: 'breeze', name: TECH.breeze.name, reason: RULES['Hard to focus'][0][1], learned: false };
  }

  function grantRewardSeed() {
    var wk = weekKey(now());
    if (state.rewardSeeds.week !== wk) state.rewardSeeds = { week: wk, count: 0 };
    if (state.rewardSeeds.count >= WEEKLY_FREE_SEEDS) return false;
    state.rewardSeeds.count++;
    state.seeds++;
    return true;
  }

  function addBadge(id, list) {
    if (state.badges.indexOf(id) === -1) { state.badges.push(id); if (list) list.push(id); }
  }

  function completeSession(input) {
    var d = now();
    var dk = dayKey(d);
    var before = clampScore(input.before), after = clampScore(input.after);
    var gain = after - before;
    var positive = Math.max(0, gain);
    var prevLevel = level().index;
    var prevBreaks = breaksDone();
    var r = { gain: gain, shownGain: positive, xpGained: 10 + 2 * positive, rainDayUsed: false, freshRun: false,
      milestone: null, milestoneSeed: false, showedUpSeed: false, sunbeam: false, sunbeamSeed: false,
      levelUp: null, newBadges: [], unlocked: [] };

    state.xp += r.xpGained;
    state.sessions.push({ ts: d.getTime(), day: dk, technique: input.technique, context: input.context || 'Just a quick lift',
      before: before, after: after, gain: gain });

    // Sunny days: once per calendar day, a Rain day bridges one quiet day per week.
    var st = state.streak;
    if (st.lastDay !== dk) {
      var gap = st.lastDay ? daysBetween(st.lastDay, dk) : null;
      if (gap === 1) st.count++;
      else if (gap === 2 && state.rainDayWeek !== weekKey(d)) { st.count++; state.rainDayWeek = weekKey(d); r.rainDayUsed = true; }
      else { r.freshRun = st.lastDay !== null; st.count = 1; }
      st.lastDay = dk;
      st.best = Math.max(st.best || 0, st.count);
      if (MILESTONES.indexOf(st.count) !== -1 && state.milestones.indexOf(st.count) === -1) {
        state.milestones.push(st.count);
        r.milestone = st.count;
        r.milestoneSeed = grantRewardSeed();
      }
    }

    if (gain <= 0) r.showedUpSeed = grantRewardSeed();

    // Sunbeam surprise: one roll per day, 25 percent chance.
    if (state.sunbeamDay !== dk) {
      state.sunbeamDay = dk;
      if (rng() < 0.25) {
        r.sunbeam = true;
        r.sunbeamSeed = grantRewardSeed();
        if (!r.sunbeamSeed) { state.xp += 5; r.xpGained += 5; }
        addBadge('sunbeam', r.newBadges);
      }
    }

    addBadge('first', r.newBadges);
    if (st.count >= 3) addBadge('streak3', r.newBadges);
    if (st.count >= 7) addBadge('streak7', r.newBadges);
    if (st.count >= 21) addBadge('streak21', r.newBadges);
    if (st.count >= 30) addBadge('streak30', r.newBadges);
    if (breaksDone() >= 10) addBadge('ten', r.newBadges);
    if (gain >= 5) addBadge('bigLift', r.newBadges);
    var tried = {};
    state.sessions.forEach(function (s) { tried[s.technique] = true; });
    if (CHOOSABLE.every(function (id) { return tried[id]; })) addBadge('explorer', r.newBadges);

    var lv = level();
    if (lv.index > prevLevel) r.levelUp = lv.name;
    CHOOSABLE.forEach(function (id) {
      var at = TECH[id].unlockAt;
      if (at > 0 && prevBreaks < at && breaksDone() >= at) r.unlocked.push(TECH[id].name);
    });

    save();
    return r;
  }

  function clampScore(v) { v = Math.round(Number(v)); return isNaN(v) ? 5 : Math.max(1, Math.min(10, v)); }

  function canStart(id) { return !!TECH[id].free || state.plan === 'fullbloom' || state.seeds > 0; }

  function nudgeAllowed(type) {
    var dk = dayKey(now());
    if (state.nudges.day !== dk) state.nudges = { day: dk, count: 0, shown: [] };
    if (state.nudges.shown.indexOf(type) !== -1) return true;
    if (state.nudges.count >= DAILY_NUDGES) return false;
    state.nudges.shown.push(type);
    state.nudges.count++;
    save();
    return true;
  }

  /* ---------- DOM helpers ---------- */

  var $ = function (id) { return document.getElementById(id); };
  function setText(id, t) { var el = $(id); if (el) el.textContent = t; }
  function mm(q) { try { return !!(window.matchMedia && window.matchMedia(q).matches); } catch (e) { return false; } }
  function prefersReducedMotion() { return mm('(prefers-reduced-motion: reduce)'); }
  function isNative() { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function signed(n) { return (n >= 0 ? '+' : '') + n; }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, parent) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2800);
  }

  /* ---------- Navigation ---------- */

  var current = null;
  var TABS = ['today', 'garden', 'week', 'me'];
  var flow = { mode: 'guided', before: 5, context: null, technique: null };

  function go(name) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].hidden = screens[i].getAttribute('data-screen') !== name;
    current = name;
    var isTab = TABS.indexOf(name) !== -1;
    $('tabbar').hidden = !isTab;
    var tabs = document.querySelectorAll('[data-tab]');
    for (var j = 0; j < tabs.length; j++) tabs[j].setAttribute('aria-selected', String(tabs[j].getAttribute('data-tab') === name));
    $('seed-pill').hidden = !state.onboarded;
    renderSeedPill();
    if (RENDER[name]) RENDER[name]();
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  }

  function renderSeedPill() {
    setText('seed-pill-count', state.plan === 'fullbloom' ? String(state.seeds) : String(state.seeds));
    $('seed-pill').setAttribute('aria-label', state.seeds + ' Seeds' + (state.plan === 'fullbloom' ? ', Full Bloom plan' : '') + '. Open the Seed shop');
  }

  /* ---------- Sheets ---------- */

  var lastFocus = null;
  function openSheet(id) {
    closeSheets(true);
    lastFocus = document.activeElement;
    $('scrim').hidden = false;
    var sh = $(id);
    sh.hidden = false;
    var f = sh.querySelector('button, a');
    if (f && f.focus) f.focus();
  }
  function closeSheets(keepFocus) {
    var sheets = document.querySelectorAll('.sheet');
    for (var i = 0; i < sheets.length; i++) sheets[i].hidden = true;
    $('scrim').hidden = true;
    if (!keepFocus && lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus();
  }

  var pendingSku = null;
  function openShop(note) {
    setText('shop-note', note || '');
    $('shop-note').hidden = !note;
    setText('shop-seeds', String(state.seeds));
    openSheet('shop-sheet');
  }
  function openCheckout(sku) {
    pendingSku = sku;
    setText('checkout-item', SKUS[sku].name);
    setText('checkout-price', SKUS[sku].price + '. Demo only, nothing is charged.');
    openSheet('checkout-sheet');
  }
  function demoPurchase(sku) {
    var item = SKUS[sku];
    if (!item) return;
    if (sku === 'fullbloom') state.plan = 'fullbloom';
    else state.seeds += item.seeds;
    state.purchases.push({ sku: sku, ts: now().getTime(), demo: true });
    save();
    renderSeedPill();
    if (RENDER[current]) RENDER[current]();
    closeSheets();
    toast(sku === 'fullbloom' ? 'Welcome to Full Bloom (demo). Enjoy every break.' : '+' + item.seeds + ' Seeds added (demo).');
  }
  function openSupport() { openSheet('support-sheet'); }

  /* ---------- Check-in and pick ---------- */

  var CALM_WORDS = ['', 'A bit tangled', 'A bit tangled', 'A little tense', 'Somewhere in the middle', 'Somewhere in the middle',
    'Fairly settled', 'Fairly calm', 'Calm', 'Very calm', 'Wonderfully calm'];
  function bindSlider(id) {
    var el = $(id);
    var upd = function () { setText(id + '-out', el.value); setText(id + '-word', CALM_WORDS[+el.value] || ''); };
    el.addEventListener('input', upd);
    el.addEventListener('change', upd);
    upd();
    return upd;
  }

  function renderContextChips() {
    var box = $('context-chips');
    box.textContent = '';
    CONTEXTS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.setAttribute('data-context', c);
      b.setAttribute('aria-pressed', String(flow.context === c));
      b.textContent = c;
      box.appendChild(b);
    });
  }

  function startCheckin(mode) {
    flow = { mode: mode, before: 5, context: null, technique: mode === 'quick' ? 'quick' : null };
    $('calm-before').value = '5';
    $('calm-before').dispatchEvent(new Event('input'));
    go('checkin');
  }

  function renderPick() {
    var rec = flow.picked ? null : recommend(flow.context);
    if (rec) { flow.technique = rec.id; flow.reason = rec.reason; }
    var t = TECH[flow.technique];
    setText('pick-name', t.name);
    setText('pick-desc', t.desc);
    setText('pick-reason', flow.reason);
    setText('pick-meta', Math.round(t.seconds / 60) + ' minutes');
    $('pick-icon').style.setProperty('--badge', t.color);
    var box = $('pick-chips');
    box.textContent = '';
    CHOOSABLE.forEach(function (id) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.setAttribute('data-pick', id);
      b.setAttribute('aria-pressed', String(id === flow.technique));
      b.textContent = TECH[id].name;
      if (!isUnlocked(id)) {
        b.disabled = true;
        var left = TECH[id].unlockAt - breaksDone();
        var sm = document.createElement('small');
        sm.textContent = 'Opens in ' + plural(left, 'more break', 'more breaks');
        b.appendChild(sm);
      }
      box.appendChild(b);
    });
    var label;
    if (state.plan === 'fullbloom') label = 'Begin (Full Bloom)';
    else if (state.seeds > 0) label = 'Begin (uses 1 of ' + plural(state.seeds, 'Seed', 'Seeds') + ')';
    else label = 'Begin (add Seeds)';
    setText('pick-begin', label);
  }

  function beginBreak(id) {
    if (!canStart(id)) {
      openShop('All your Seeds are planted. Add a few more, or take a free Quick breeze.');
      return 'shop';
    }
    if (!TECH[id].free && state.plan !== 'fullbloom') state.seeds--;
    save();
    startSession(id);
    return 'started';
  }

  /* ---------- Guided session ---------- */

  var run = null;
  var orbTimer = null;

  function startSession(id) {
    stopRun();
    var t = TECH[id];
    flow.technique = id;
    run = { id: id, left: t.seconds, paused: false, phase: -1, phaseLeft: 0, step: 0, stepLeft: 0, crisisShown: false };
    var scr = $('screen-session');
    scr.classList.toggle('steps', t.kind === 'steps');
    scr.classList.toggle('journal', t.kind === 'journal');
    setText('session-title', t.name);
    $('step-box').hidden = t.kind !== 'steps';
    $('journal-box').hidden = t.kind !== 'journal';
    $('letitout-text').value = '';
    setText('session-pause', 'Pause');
    $('session-pause').setAttribute('aria-pressed', 'false');
    renderVoiceButtons();
    setText('session-finish', 'Finish early');
    go('session');
    var orb = $('orb');
    orb.style.transitionDuration = '0s';
    orb.style.transform = 'scale(0.62)';
    if (t.kind === 'steps') { run.stepLeft = Math.floor(t.seconds / t.steps.length); showStep(0); }
    if (t.kind === 'journal') { setText('cue', ''); }
    if (t.kind === 'breath') nextPhase();
    updateTime();
    run.timer = setInterval(tick, 1000);
  }

  function nextPhase() {
    var t = TECH[run.id];
    run.phase = (run.phase + 1) % t.pattern.length;
    var ph = t.pattern[run.phase];
    run.phaseLeft = ph[1];
    setText('cue', ph[0]);
    speak(ph[0]);
    var orb = $('orb');
    if (prefersReducedMotion()) { orb.style.transform = ''; return; }
    orb.style.transitionDuration = ph[1] + 's';
    clearTimeout(orbTimer);
    orbTimer = setTimeout(function () { orb.style.transform = 'scale(' + ph[2] + ')'; }, 30);
  }

  function showStep(i) {
    var t = TECH[run.id];
    run.step = i;
    setText('step-count', 'Step ' + (i + 1) + ' of ' + t.steps.length);
    setText('step-text', t.steps[i]);
    speak(t.steps[i]);
    $('step-next').hidden = i >= t.steps.length - 1;
    var orb = $('orb');
    if (!prefersReducedMotion()) { orb.style.transitionDuration = '1.2s'; orb.style.transform = 'scale(' + (0.7 + 0.06 * i) + ')'; }
  }

  function tick() {
    if (!run || run.paused) return;
    run.left--;
    var t = TECH[run.id];
    if (t.kind === 'breath') { run.phaseLeft--; if (run.phaseLeft <= 0) nextPhase(); }
    if (t.kind === 'steps') {
      run.stepLeft--;
      if (run.stepLeft <= 0 && run.step < t.steps.length - 1) { run.stepLeft = Math.floor(t.seconds / t.steps.length); showStep(run.step + 1); }
    }
    updateTime();
    if (run.left <= 0) endSession(true);
  }

  function updateTime() {
    var s = Math.max(0, run.left);
    setText('session-time', Math.floor(s / 60) + ':' + pad(s % 60));
  }

  function stopRun() {
    if (run && run.timer) clearInterval(run.timer);
    clearTimeout(orbTimer);
    if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) { /* no voice */ } }
  }

  function endSession(complete) {
    if (!run) return;
    stopRun();
    $('letitout-text').value = '';
    run = null;
    var after = $('calm-after');
    after.value = String(flow.before);
    after.dispatchEvent(new Event('input'));
    go('after');
    if (complete) speak('Lovely. How do you feel now?');
  }

  function togglePause() {
    if (!run) return;
    run.paused = !run.paused;
    setText('session-pause', run.paused ? 'Resume' : 'Pause');
    $('session-pause').setAttribute('aria-pressed', String(run.paused));
    if (run.paused && window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) { /* no voice */ } }
  }

  function canSpeak() { return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function'; }
  function speak(text) {
    if (!state.voice || !canSpeak()) return;
    try {
      window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance(text);
      u.rate = 0.9; u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    } catch (e) { /* voice not available */ }
  }
  function renderVoiceButtons() {
    var on = !!state.voice;
    setText('session-voice', on ? 'Voice on' : 'Voice off');
    $('session-voice').setAttribute('aria-pressed', String(on));
    setText('voice-toggle', on ? 'Voice is on' : 'Voice is off');
    $('voice-toggle').setAttribute('aria-pressed', String(on));
  }
  function toggleVoice() {
    state.voice = !state.voice;
    save();
    renderVoiceButtons();
    if (state.voice && !canSpeak()) toast('Voice guide is not available on this device, the on-screen cues will guide you.');
    else if (state.voice) speak('Voice guide on.');
  }

  /* ---------- Result ---------- */

  function finishAfter() {
    var before = flow.before;
    var after = clampScore($('calm-after').value);
    var r = completeSession({ technique: flow.technique || 'quick', context: flow.context || 'Just a quick lift', before: before, after: after });
    renderResult(r);
    go('result');
  }

  function renderResult(r) {
    var name = state.name || 'friend';
    setText('result-headline', r.gain > 0 ? 'Lovely, ' + name + '!' : 'You showed up, ' + name + '.');
    var g = $('result-gain');
    g.textContent = signed(r.shownGain);
    g.setAttribute('aria-label', signed(r.shownGain) + ' Calm gain');
    setText('result-garden', '+1 flower');
    setText('result-seeds', state.plan === 'fullbloom' ? plural(state.seeds, 'Seed', 'Seeds') + ' (Full Bloom)' : plural(state.seeds, 'Seed', 'Seeds') + ' left');
    setText('result-streak', plural(state.streak.count, 'Sunny day', 'Sunny days'));
    var lv = level();
    setText('result-level', lv.name + ' ' + lv.percent + '%');
    var items = [];
    items.push('+' + r.xpGained + ' XP');
    if (r.gain <= 0) items.push(r.showedUpSeed ? 'You showed up: +1 Seed' : 'You showed up, and that counts.');
    if (r.rainDayUsed) items.push('A Rain day kept your Sunny days going.');
    if (r.freshRun) items.push('A fresh run of Sunny days starts today.');
    if (r.milestone) items.push(plural(r.milestone, 'Sunny day', 'Sunny days') + '! ' + (r.milestoneSeed ? '+1 Seed' : 'Milestone badge earned.'));
    if (r.sunbeam) items.push('A Sunbeam surprise! ' + (r.sunbeamSeed ? '+1 Seed' : '+5 bonus XP'));
    if (r.levelUp) items.push('You grew into a ' + r.levelUp + '!');
    r.unlocked.forEach(function (n) { items.push(n + ' is now open for you.'); });
    r.newBadges.forEach(function (b) { if (b !== 'first' || breaksDone() === 1) items.push('Badge: ' + BADGES[b][0]); });
    var ul = $('result-rewards');
    ul.textContent = '';
    items.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    var note = r.gain <= 0 ? 'You made time for yourself today, and that is what matters most.' : NOTES[(breaksDone() - 1) % NOTES.length];
    setText('result-note', note);
    // Restart the sunrise animation.
    var rise = document.querySelector('.rs-rise');
    if (rise && rise.getBBox !== undefined) { rise.style.animation = 'none'; void rise.getBoundingClientRect(); rise.style.animation = ''; }
  }

  /* ---------- Tabs ---------- */

  function greeting() {
    var b = bucketOf(now().getTime());
    var name = state.name || 'friend';
    return { Mornings: 'Good morning, ', Afternoons: 'Good afternoon, ', Evenings: 'Good evening, ', 'Quiet nights': 'Hello, night owl ' }[b] + name;
  }

  function renderToday() {
    setText('today-title', greeting());
    setText('today-streak', plural(state.streak.count, 'Sunny day', 'Sunny days'));
    setText('today-seeds', state.plan === 'fullbloom' ? 'Full Bloom' : String(state.seeds));
    var lv = level();
    setText('today-level-name', lv.name);
    $('today-level-fill').style.width = lv.percent + '%';
    $('today-level-bar').setAttribute('aria-valuenow', String(lv.percent));
    setText('today-level-pct', lv.next ? lv.percent + '% of the way to ' + lv.next : 'Your meadow is in full glow');
    var wk = weekKey(now());
    setText('today-rain', state.rainDayWeek === wk ? 'This week\'s Rain day is already watering your streak.' : 'One Rain day is ready this week if you take a day off.');
    var ul = $('today-recent');
    ul.textContent = '';
    var recent = state.sessions.slice(-3).reverse();
    if (!recent.length) {
      var li0 = document.createElement('li');
      li0.textContent = 'Your first break will bloom here.';
      ul.appendChild(li0);
    }
    recent.forEach(function (s) {
      var li = document.createElement('li');
      var a = document.createElement('span');
      a.textContent = (TECH[s.technique] ? TECH[s.technique].name : 'Break') + ', ' + s.context;
      var g = document.createElement('span');
      g.className = 'g';
      g.textContent = signed(Math.max(0, s.gain)) + ' Calm gain';
      li.appendChild(a); li.appendChild(g);
      ul.appendChild(li);
    });
    renderGoldenBanner();
  }

  function renderGoldenBanner() {
    var show = false;
    if (state.goldenHour) {
      var d = now();
      var hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
      var doneToday = state.streak.lastDay === dayKey(d);
      if (hm >= state.goldenHour && !doneToday) show = nudgeAllowed('golden');
    }
    $('golden-banner').hidden = !show;
  }

  // Garden: one flower per break, decorations per level. It only ever grows.
  function seeded(i) {
    var t = (i + 1) * 0x6D2B79F5;
    return function () {
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function renderGarden() {
    var g = $('garden-svg');
    while (g.firstChild) g.removeChild(g.firstChild);
    var lv = level();
    var defs = svg('defs', {}, g);
    var lg = svg('linearGradient', { id: 'gsky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    svg('stop', { offset: 0, 'stop-color': '#CFE8FF' }, lg);
    svg('stop', { offset: 1, 'stop-color': '#FFF6E3' }, lg);
    svg('rect', { x: 0, y: 0, width: 360, height: 260, fill: 'url(#gsky)' }, g);
    var sunR = 20 + lv.index * 4;
    svg('circle', { cx: 300, cy: 52, r: sunR + 12, fill: '#FFC857', opacity: 0.25 }, g);
    svg('circle', { cx: 300, cy: 52, r: sunR, fill: '#FFC857' }, g);
    if (lv.index >= 4) {
      ['#FFB088', '#FFC857', '#4FA67C', '#8CC8F0'].forEach(function (c, i) {
        svg('path', { d: 'M20 170 A160 130 0 0 1 340 170', fill: 'none', stroke: c, 'stroke-width': 7, opacity: 0.55, transform: 'translate(0 ' + (i * 8) + ')' }, g);
      });
    }
    svg('path', { d: 'M0 150 Q90 120 180 146 T360 136 V260 H0Z', fill: '#7AC498' }, g);
    if (lv.index >= 5) svg('path', { d: 'M0 170 Q120 140 240 164 T360 150 V260 H0Z', fill: '#66B88A' }, g);
    svg('path', { d: 'M0 178 Q120 160 220 176 T360 172 V260 H0Z', fill: '#4FA67C' }, g);
    if (lv.index >= 2) {
      svg('rect', { x: 48, y: 112, width: 8, height: 54, rx: 3, fill: '#8B6B4A' }, g);
      svg('circle', { cx: 52, cy: 104, r: 26, fill: '#2E7D5B' }, g);
      svg('circle', { cx: 38, cy: 116, r: 16, fill: '#4FA67C' }, g);
      svg('circle', { cx: 66, cy: 114, r: 18, fill: '#3F9A6E' }, g);
    }
    if (lv.index >= 3) svg('ellipse', { cx: 250, cy: 214, rx: 46, ry: 11, fill: '#8CC8F0', opacity: 0.85 }, g);
    if (lv.index >= 1) {
      [[150, 96], [214, 120]].forEach(function (p, i) {
        var b = svg('g', { transform: 'translate(' + p[0] + ' ' + p[1] + ')' }, g);
        svg('ellipse', { cx: -5, cy: 0, rx: 6, ry: 4, fill: i ? '#FFB088' : '#C9A7F2', transform: 'rotate(-30)' }, b);
        svg('ellipse', { cx: 5, cy: 0, rx: 6, ry: 4, fill: i ? '#FFB088' : '#C9A7F2', transform: 'rotate(30)' }, b);
      });
    }
    var n = state.sessions.length;
    var shown = Math.min(n, 90);
    for (var i = 0; i < shown; i++) {
      var s = state.sessions[i];
      var r = seeded(i);
      // The first flowers bloom near the middle, later ones spread across the meadow.
      var spread = Math.min(1, 0.25 + i / 24);
      var x = 180 + (r() * 2 - 1) * 160 * spread;
      var y = 200 + r() * 48;
      var size = 9 + r() * 4 - Math.min(4, i / 20);
      var color = (TECH[s.technique] || TECH.breeze).color;
      var f = svg('g', { 'class': 'flower' + (i === n - 1 ? ' new' : '') }, g);
      svg('path', { d: 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' q ' + (r() * 8 - 4).toFixed(1) + ' -12 0 -' + (18 + size).toFixed(1), stroke: '#2E7D5B', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, f);
      svg('ellipse', { cx: (x + 5).toFixed(1), cy: (y - 8).toFixed(1), rx: 5, ry: 2.5, fill: '#2E7D5B', transform: 'rotate(-30 ' + (x + 5).toFixed(1) + ' ' + (y - 8).toFixed(1) + ')' }, f);
      var cy = y - 18 - size;
      for (var k = 0; k < 5; k++) {
        var a = k * 72 * Math.PI / 180;
        svg('circle', { cx: (x + Math.cos(a) * size * 0.8).toFixed(1), cy: (cy + Math.sin(a) * size * 0.8).toFixed(1), r: (size * 0.62).toFixed(1), fill: color }, f);
      }
      svg('circle', { cx: x.toFixed(1), cy: cy.toFixed(1), r: (size * 0.45).toFixed(1), fill: '#FFC857' }, f);
    }
    if (!n) {
      var tx = svg('text', { x: 180, y: 222, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#FFFFFF' }, g);
      tx.textContent = 'Your first flower is one break away';
    }
    g.setAttribute('aria-label', 'Your garden with ' + plural(n, 'flower', 'flowers') + ', level ' + lv.name);
    setText('garden-caption', n ? plural(n, 'flower', 'flowers') + '. Your garden grows with every break and stays in bloom.' : 'Every break plants a flower here.');
    setText('garden-level', lv.name);
    setText('garden-level-pct', lv.percent + '%');
    $('garden-level-fill').style.width = lv.percent + '%';
    setText('garden-next', lv.next ? lv.toNext + ' XP to ' + lv.next + '. Each break gives 10 XP, plus 2 for every point of Calm gain.' : 'You have reached Meadow. Everything keeps growing.');
    var ul = $('badges');
    ul.textContent = '';
    Object.keys(BADGES).forEach(function (id) {
      var li = document.createElement('li');
      var has = state.badges.indexOf(id) !== -1;
      if (!has) li.className = 'dim';
      var st = document.createElement('strong');
      st.textContent = BADGES[id][0];
      var sp = document.createElement('span');
      sp.textContent = has ? BADGES[id][1] : 'Still growing: ' + BADGES[id][1].toLowerCase();
      li.appendChild(st); li.appendChild(sp);
      ul.appendChild(li);
    });
  }

  function renderWeek() {
    var c = $('week-chart');
    while (c.firstChild) c.removeChild(c.firstChild);
    var today = now();
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 12);
      days.push({ key: dayKey(d), label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()], gain: 0, n: 0 });
    }
    var byKey = {};
    days.forEach(function (d) { byKey[d.key] = d; });
    var weekSessions = [];
    state.sessions.forEach(function (s) {
      var d = byKey[s.day];
      if (d) { d.n++; d.gain += Math.max(0, s.gain); weekSessions.push(s); }
    });
    var max = Math.max(5, Math.max.apply(null, days.map(function (d) { return d.gain; })));
    svg('line', { x1: 10, y1: 150, x2: 330, y2: 150, stroke: 'rgba(34,48,56,.15)', 'stroke-width': 2 }, c);
    days.forEach(function (d, i) {
      var x = 18 + i * 45;
      var h = d.n ? Math.max(10, (d.gain / max) * 110) : 4;
      svg('rect', { x: x, y: 150 - h, width: 32, height: h, rx: 10, fill: d.n ? '#4FA67C' : '#CFE8FF' }, c);
      if (d.n) {
        svg('circle', { cx: x + 16, cy: 150 - h - 12, r: 7, fill: '#FFC857' }, c);
        var v = svg('text', { x: x + 16, y: 150 - h - 24, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#2E7D5B' }, c);
        v.textContent = signed(d.gain);
      }
      var t = svg('text', { x: x + 16, y: 172, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#4A5A63' }, c);
      t.textContent = d.label;
    });
    var total = weekSessions.reduce(function (a, s) { return a + Math.max(0, s.gain); }, 0);
    setText('week-count', String(weekSessions.length));
    setText('week-avg', weekSessions.length ? signed(Math.round(total / weekSessions.length * 10) / 10) : '+0');
    c.setAttribute('aria-label', 'Calm gain for the last 7 days: ' + days.map(function (d) { return d.label + ' ' + signed(d.gain); }).join(', '));
    var ins = insights();
    setText('insight-tech', ins.tech);
    setText('insight-time', ins.time);
  }

  function insights() {
    var all = state.sessions;
    if (!all.length) return { tech: 'Take a break or two and we will show you what lifts you most.', time: '' };
    var by = function (keyFn) {
      var m = {};
      all.forEach(function (s) { var k = keyFn(s); var e = m[k] || (m[k] = { n: 0, sum: 0 }); e.n++; e.sum += s.gain; });
      var best = null;
      Object.keys(m).forEach(function (k) { var avg = m[k].sum / m[k].n; if (!best || avg > best.avg) best = { key: k, avg: avg, n: m[k].n }; });
      return best;
    };
    var bt = by(function (s) { return s.technique; });
    var bb = by(function (s) { return bucketOf(s.ts); });
    var tname = TECH[bt.key] ? TECH[bt.key].name : 'Your breaks';
    return {
      tech: tname + ' lifts you most, with an average Calm gain of ' + signed(Math.round(Math.max(0, bt.avg) * 10) / 10) + '.',
      time: bb.key + ' are your brightest time for a break.'
    };
  }

  function renderMe() {
    setText('me-title', state.name ? state.name + '\'s corner' : 'Your corner');
    setText('me-seeds', plural(state.seeds, 'Seed', 'Seeds'));
    setText('me-plan', state.plan === 'fullbloom' ? 'Full Bloom plan (demo): guided breaks use no Seeds.' : 'Free plan. Quick breeze is always free.');
    if (state.goldenHour) $('golden-time').value = state.goldenHour;
    $('golden-clear').hidden = !state.goldenHour;
    setText('golden-help', state.goldenHour
      ? 'Golden hour is set for ' + state.goldenHour + '. ' + (isNative() ? 'One gentle reminder arrives each day.' : 'A gentle note appears in the app from that time.')
      : (isNative() ? 'Pick a daily time for one gentle reminder.' : 'Pick a daily time and a gentle note will appear in the app. The phone apps can send one daily reminder.'));
    renderVoiceButtons();
    renderInstall();
  }

  var RENDER = { today: renderToday, garden: renderGarden, week: renderWeek, me: renderMe, pick: renderPick, checkin: renderContextChips };

  /* ---------- Golden hour, sharing, install ---------- */

  function nativeNotifications() {
    return isNative() && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
  }
  function scheduleGoldenHour() {
    var LN = nativeNotifications();
    if (!LN) return Promise.resolve(false);
    return LN.cancel({ notifications: [{ id: 1 }] }).catch(function () {}).then(function () {
      if (!state.goldenHour) return false;
      return LN.requestPermissions().then(function (p) {
        if (p && p.display && p.display !== 'granted') { toast('Reminders are off in your settings. The in-app note still works.'); return false; }
        var hm = state.goldenHour.split(':');
        return LN.schedule({ notifications: [{
          id: 1, title: 'Golden hour', body: 'Two calm minutes are here for you whenever you like.',
          schedule: { on: { hour: +hm[0], minute: +hm[1] }, allowWhileIdle: true }
        }] }).then(function () { return true; });
      });
    }).catch(function () { return false; });
  }
  function saveGoldenHour() {
    var v = $('golden-time').value;
    if (!/^\d{2}:\d{2}$/.test(v)) { toast('Pick a time first.'); return; }
    state.goldenHour = v;
    addBadge('golden');
    save();
    scheduleGoldenHour();
    renderMe();
    toast('Golden hour set for ' + v + '.');
  }
  function clearGoldenHour() {
    state.goldenHour = null;
    save();
    scheduleGoldenHour();
    renderMe();
    toast('Golden hour is off. You can set it again any time.');
  }

  function shareUrl() { return /^https?:$/.test(location.protocol) && !isNative() && location.hostname !== 'localhost' ? location.origin : PUBLIC_URL; }
  function shareSunbeam() {
    var url = shareUrl();
    var text = 'Two calm minutes that brighten my day. Grow a garden with me on Brightside.';
    var rewardShare = function () {
      var dk = dayKey(now());
      addBadge('sharer');
      if (state.referralDay === dk) { save(); toast('Thanks for sharing a Sunbeam!'); return; }
      state.referralDay = dk;
      var got = grantRewardSeed();
      save();
      renderSeedPill();
      if (RENDER[current]) RENDER[current]();
      toast(got ? 'Thanks for sharing a Sunbeam! +1 Seed' : 'Thanks for sharing a Sunbeam! Your free Seeds for this week are all gathered.');
    };
    var copy = function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text + ' ' + url).then(function () { toast('Link copied. Share it anywhere you like.'); rewardShare(); },
          function () { toast('Share this link: ' + url); });
      }
      toast('Share this link: ' + url);
      return Promise.resolve();
    };
    if (navigator.share) {
      return navigator.share({ title: 'Brightside', text: text, url: url }).then(rewardShare, function (e) {
        if (e && e.name === 'AbortError') return;
        return copy();
      });
    }
    return copy();
  }

  var installEvt = null;
  function isStandalone() { return mm('(display-mode: standalone)') || window.navigator.standalone === true || isNative(); }
  function renderInstall() {
    var card = $('install-card');
    if (isNative()) { card.hidden = true; return; }
    card.hidden = false;
    var ua = navigator.userAgent || '';
    var ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    $('install-btn').hidden = !installEvt;
    if (isStandalone()) setText('install-text', 'Brightside is installed. Lovely to have you here.');
    else if (installEvt) setText('install-text', 'Add Brightside to your home screen for quick, offline breaks.');
    else if (ios) setText('install-text', 'On iPhone: open this page in Safari, tap Share, then Add to Home Screen.');
    else setText('install-text', 'On Android: open the Chrome menu, then Install app. On iPhone: Safari Share, then Add to Home Screen.');
  }

  function registerSW() {
    if (!('serviceWorker' in navigator) || isNative() || !/^https?:$/.test(location.protocol)) return;
    var reg = function () { navigator.serviceWorker.register('/sw.js').catch(function () { /* offline support is optional */ }); };
    if (document.readyState === 'complete') reg(); else window.addEventListener('load', reg);
  }

  /* ---------- Events ---------- */

  function onClick(e) {
    var el = e.target.closest ? e.target.closest('button, a, [data-context]') : null;
    if (!el) return;
    if (el.disabled) return;
    var id = el.id;
    var ctx = el.getAttribute('data-context');
    var pick = el.getAttribute('data-pick');
    var tab = el.getAttribute('data-tab');
    var sku = el.getAttribute('data-sku');
    if (ctx) {
      flow.context = ctx;
      var chips = document.querySelectorAll('[data-context]');
      for (var i = 0; i < chips.length; i++) chips[i].setAttribute('aria-pressed', String(chips[i] === el));
      return;
    }
    if (pick) {
      if (!isUnlocked(pick)) return;
      flow.technique = pick;
      flow.picked = true;
      flow.reason = pick === recommend(flow.context).id ? recommend(flow.context).reason : 'Your choice. Enjoy it.';
      renderPick();
      return;
    }
    if (tab) { go(tab); return; }
    if (sku) { openCheckout(sku); return; }
    switch (id) {
      case 'gift-go': startCheckin('guided'); break;
      case 'checkin-next':
        flow.before = clampScore($('calm-before').value);
        if (!flow.context) flow.context = 'Just a quick lift';
        if (flow.mode === 'quick') beginBreak('quick');
        else { flow.picked = false; go('pick'); }
        break;
      case 'checkin-back': go(state.onboarded ? 'today' : 'gift'); break;
      case 'pick-begin': beginBreak(flow.technique); break;
      case 'pick-quick': beginBreak('quick'); break;
      case 'session-finish': endSession(false); break;
      case 'session-pause': togglePause(); break;
      case 'session-voice': case 'voice-toggle': toggleVoice(); break;
      case 'step-next': if (run && TECH[run.id].steps && run.step < TECH[run.id].steps.length - 1) { run.stepLeft = Math.floor(TECH[run.id].seconds / TECH[run.id].steps.length); showStep(run.step + 1); } break;
      case 'after-next': finishAfter(); break;
      case 'result-done': go('today'); break;
      case 'start-break': startCheckin('guided'); break;
      case 'quick-breeze': startCheckin('quick'); break;
      case 'seed-pill': case 'open-shop': openShop(); break;
      case 'shop-close': case 'checkout-cancel': case 'support-close': case 'reset-cancel': closeSheets(); break;
      case 'shop-quick':
        closeSheets(true);
        if (current === 'pick') beginBreak('quick'); else startCheckin('quick');
        break;
      case 'checkout-confirm': demoPurchase(pendingSku); break;
      case 'open-support': openSupport(); break;
      case 'golden-save': saveGoldenHour(); break;
      case 'golden-clear': clearGoldenHour(); break;
      case 'sunbeam-share': shareSunbeam(); break;
      case 'install-btn':
        if (installEvt) { installEvt.prompt(); installEvt.userChoice.then(function () { installEvt = null; renderInstall(); }); }
        break;
      case 'reset-btn': openSheet('confirm-sheet'); break;
      case 'reset-confirm':
        stopRun();
        try { window.localStorage.removeItem(KEY); } catch (err) { /* nothing stored */ }
        state = freshState();
        scheduleGoldenHour();
        closeSheets(true);
        $('name-input').value = '';
        go('welcome');
        toast('A fresh start. Welcome back.');
        break;
      default: break;
    }
  }

  function onWelcome(e) {
    e.preventDefault();
    var name = ($('name-input').value || '').trim().replace(/\s+/g, ' ').slice(0, 24);
    state.name = name || 'friend';
    if (!state.onboarded) {
      state.onboarded = true;
      state.createdAt = now().getTime();
      state.seeds += 5;
      state.xp += 25;
    }
    save();
    var slots = document.querySelectorAll('.name-slot');
    for (var i = 0; i < slots.length; i++) slots[i].textContent = state.name;
    $('gift-level-fill').style.width = level().percent + '%';
    go('gift');
  }

  function onJournal() {
    var v = $('letitout-text').value;
    if (run && !run.crisisShown && isCrisis(v)) { run.crisisShown = true; openSupport(); }
    else if (!run && isCrisis(v)) openSupport();
  }

  function init() {
    document.addEventListener('click', onClick);
    $('welcome-form').addEventListener('submit', onWelcome);
    $('letitout-text').addEventListener('input', onJournal);
    $('scrim').addEventListener('click', function () { closeSheets(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('scrim').hidden) closeSheets(); });
    bindSlider('calm-before');
    bindSlider('calm-after');
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; if (current === 'me') renderInstall(); });
    window.addEventListener('appinstalled', function () { installEvt = null; toast('Brightside is on your home screen.'); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && current === 'today') renderGoldenBanner(); });
    go(state.onboarded ? 'today' : 'welcome');
    registerSW();
    if (state.goldenHour) scheduleGoldenHour();
  }

  /* ---------- Public API (used by the app shell and the test suite) ---------- */

  window.Brightside = {
    version: VERSION,
    state: function () { return JSON.parse(JSON.stringify(state)); },
    setState: function (patch) { for (var k in patch) state[k] = patch[k]; save(); if (current && RENDER[current]) RENDER[current](); renderSeedPill(); },
    setNow: function (d) { nowOverride = d ? new Date(d) : null; },
    setRng: function (fn) { rng = fn || Math.random; },
    currentScreen: function () { return current; },
    go: go,
    level: function () { return level(); },
    recommend: recommend,
    isUnlocked: isUnlocked,
    completeSession: completeSession,
    beginBreak: beginBreak,
    openShop: function (note) { openShop(note); },
    demoPurchase: demoPurchase,
    isCrisis: isCrisis,
    dayKey: dayKey,
    weekKey: weekKey,
    prefersReducedMotion: prefersReducedMotion,
    shareSunbeam: shareSunbeam,
    techniques: TECH
  };

  // The script is deferred, so the DOM is ready; fall back to DOMContentLoaded if it is not.
  if (document.getElementById('tabbar')) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
