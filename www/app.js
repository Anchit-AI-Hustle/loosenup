/* LoosenUp - 2-minute guided calm breaks. Data stays on this device (localStorage). */
(function () {
  'use strict';

  var VERSION = '2.0.1';
  var KEY = 'loosenup.v1';
  var PUBLIC_URL = 'https://loosenup-ios.anchit-tandon.com';
  var ANDROID_URL = 'https://loosenup-android.anchit-tandon.com';
  var IOS_URL = 'https://loosenup-ios.anchit-tandon.com';
  var WEEKLY_FREE_SEEDS = 2;
  var DAILY_NUDGES = 2;
  var MILESTONES = [3, 7, 21, 30];
  var GAME_XP = 5;
  var DAILY_GAME_REWARDS = 3;

  var TEST = window.__LOOSENUP_TEST__ || {};
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
      id: 'release', name: 'Soft release', seconds: 120, unlockAt: 0, color: '#C9A7F2', kind: 'steps',
      desc: 'Tense each area for a breath, then let it go soft, from shoulders to toes.',
      steps: ['Lift your shoulders up to your ears. Hold. Let them drop.', 'Make two fists. Squeeze. Open your hands wide and soft.',
        'Scrunch your face. Then let your jaw hang loose.', 'Press your feet into the floor. Then let them rest.', 'Take one long breath and feel your whole body settle.']
    },
    letitout: {
      id: 'letitout', name: 'Let it out', seconds: 120, unlockAt: 0, color: '#FFC857', kind: 'journal',
      desc: 'Two minutes to type whatever is on your mind. Nothing is saved.'
    },
    kind: {
      id: 'kind', name: 'Kind words', seconds: 120, unlockAt: 0, color: '#F28FA0', kind: 'steps', space: 'lowdays',
      desc: 'A gentle self-compassion break for when your inner voice feels harsh.',
      steps: ['Place a hand on your heart or your cheek. Feel its warmth.', 'Name it softly: this is a hard moment.',
        'Remember: everyone has hard moments. You are not alone in this.', 'Say to yourself: may I be kind to myself right now.',
        'Ask: what would I say to a dear friend who felt this way? Say it to you.']
    },
    desk: {
      id: 'desk', name: 'Desk reset', seconds: 120, unlockAt: 0, color: '#8CC8F0', kind: 'steps', space: 'work',
      desc: 'Release the workday from your body without leaving your chair.',
      steps: ['Roll your shoulders back slowly, five times.', 'Tilt one ear toward your shoulder, then the other.',
        'Press your palms together for a breath, then let them go soft.', 'Look at something far away for twenty seconds.',
        'Sit tall, feet flat, and take one long breath out.']
    },
    square: {
      id: 'square', name: 'Steady square', seconds: 120, unlockAt: 0, color: '#6FB3E0', kind: 'breath', space: 'work',
      desc: 'Box breathing: in for four, hold for four, out for four, rest for four.',
      pattern: [['Breathe in', 4, 1], ['Hold gently', 4, 1], ['Breathe out', 4, 0.6], ['Rest', 4, 0.6]]
    },
    pause: {
      id: 'pause', name: 'Pause before replying', seconds: 120, unlockAt: 0, color: '#FFB088', kind: 'steps', space: 'relationships',
      desc: 'A few calm steps so you can answer from care, not from heat.',
      steps: ['Take one slow breath before you say anything.', 'Name the feeling in one word.', 'Ask yourself: what do I need right now?',
        'Ask: what might they be feeling?', 'Choose one kind, honest sentence to begin with.']
    },
    cooldown: {
      id: 'cooldown', name: 'Cool down', seconds: 120, unlockAt: 0, color: '#9ED3C4', kind: 'breath', space: 'relationships',
      desc: 'Long breaths out that help your body settle after a disagreement.',
      pattern: [['Breathe in', 4, 1], ['Long breath out', 7, 0.6]]
    },
    warmth: {
      id: 'warmth', name: 'Warm wishes', seconds: 120, unlockAt: 0, color: '#F7C59F', kind: 'steps', space: 'relationships',
      desc: 'Send kind wishes to someone you love, someone you feel tense with, and yourself.',
      steps: ['Picture someone you care about and smile at them in your mind.', 'Wish them: may you feel safe and at ease.',
        'Now picture the person you feel tense with.', 'Wish them: may you find some ease too.', 'Wish yourself the same: may I feel at ease.']
    },
    quick: {
      id: 'quick', name: 'Quick breeze', seconds: 60, unlockAt: 0, color: '#CFE8FF', kind: 'breath', free: true,
      desc: 'Sixty seconds of slow, easy breathing. Always free.',
      pattern: [['Breathe in', 4, 1], ['Breathe out', 6, 0.6]]
    }
  };
  var INTRO = {
    breath: 'Let us begin. Sit comfortably, let your shoulders drop, and follow the sun as it opens and closes.',
    steps: 'Let us begin. Take your time with each step. There is no rush.',
    journal: 'Let us begin. Type whatever is on your mind. Nothing is saved.'
  };
  var OUTRO = 'Lovely. Take a moment to notice how you feel now.';
  var CHOOSABLE = ['sigh', 'breeze', 'here', 'release', 'letitout', 'kind', 'desk', 'square', 'pause', 'cooldown', 'warmth'];

  // Spaces group feelings by what people are carrying: everyday, work, relationships, low days and sleep.
  var SPACES = {
    everyday: { name: 'Everyday', contexts: ['Busy mind', 'Tight shoulders', 'Big moment ahead', 'Hard to focus', 'Just a quick lift'] },
    work: { name: 'Work', contexts: ['Work pile-up', 'Before a meeting', 'After a tough call', 'Hard to switch off'] },
    relationships: { name: 'Relationships', contexts: ['Tense with someone', 'After a disagreement', 'Before a hard talk', 'Feeling disconnected'] },
    lowdays: { name: 'Low days', contexts: ['Feeling low', 'Low energy', 'Hard on myself'] },
    sleep: { name: 'Sleep', contexts: ['Winding down', 'Mind racing at night'] }
  };
  var SPACE_ORDER = ['everyday', 'work', 'relationships', 'lowdays', 'sleep'];
  var CONTEXTS = [];
  SPACE_ORDER.forEach(function (k) { CONTEXTS = CONTEXTS.concat(SPACES[k].contexts); });
  function spaceOf(context) {
    for (var i = 0; i < SPACE_ORDER.length; i++) if (SPACES[SPACE_ORDER[i]].contexts.indexOf(context) !== -1) return SPACE_ORDER[i];
    return 'everyday';
  }
  var RULES = {
    'Busy mind': [['letitout', 'Putting thoughts into words can make a busy mind feel roomier.'],
      ['here', 'Noticing what is around you gently brings a busy mind back to now.']],
    'Tight shoulders': [['release', 'Tensing and softening helps shoulders let go.'],
      ['sigh', 'A long breath out is a quick way to soften tight shoulders.']],
    'Big moment ahead': [['sigh', 'A couple of long breaths out can help you feel steady before a big moment.']],
    'Hard to focus': [['breeze', 'Slow, even breathing gives your attention a calm rhythm to follow.']],
    'Winding down': [['release', 'Letting each muscle go soft is a lovely way to wind down.'],
      ['breeze', 'Slow breathing is a gentle way to wind down.']],
    'Just a quick lift': [['sigh', 'A Sigh of relief is the quickest lift we know.']],
    'Work pile-up': [['square', 'A steady square breath helps you take one thing at a time.']],
    'Before a meeting': [['square', 'Four calm counts in, hold, out and rest help you walk in steady.']],
    'After a tough call': [['desk', 'A quick desk reset helps your body let go of the last call.']],
    'Hard to switch off': [['release', 'Softening each muscle tells your body the workday is done.'],
      ['breeze', 'Slow breathing helps you move from work mode to you mode.']],
    'Tense with someone': [['pause', 'A pause before replying helps you answer from calm.']],
    'After a disagreement': [['cooldown', 'Long breaths out help your body settle after a disagreement.']],
    'Before a hard talk': [['square', 'Steady breaths help you begin a hard talk feeling grounded.']],
    'Feeling disconnected': [['warmth', 'Sending warm wishes can help you feel closer to the people you care about.']],
    'Feeling low': [['kind', 'Kind words to yourself can soften a heavy day.']],
    'Low energy': [['here', 'Gently noticing the world around you can bring a small lift.']],
    'Hard on myself': [['kind', 'Speak to yourself the way you would speak to a dear friend.']],
    'Mind racing at night': [['letitout', 'Putting thoughts on the page can help a racing mind settle.'],
      ['release', 'Softening the body can help a racing mind slow down.'],
      ['breeze', 'Slow breathing helps a racing mind ease toward sleep.']]
  };

  var MOODS = [null, 'Crying', 'Sad', 'Okay', 'Decent', 'Happy'];
  var MOOD_NOTES = [null,
    'Thank you for being honest. It is okay to cry. Kind words or a Small step are here for you, and so is SOS.',
    'Sad days happen. Kind words or a Small step can help a little.',
    'Okay is okay. A Small step could add a little lift.',
    'A decent day. A calm break can keep the good going.',
    'Happy today. Lovely! Maybe share LoosenUp with someone who could use it.'];
  var STEPS = ['Step outside or by a window for two minutes of daylight.', 'Drink a full glass of water, slowly.',
    'Stretch your arms up high, then let them float down.', 'Send a short hello to someone you trust.',
    'Tidy one small thing near you.', 'Play one song you love and let yourself enjoy it.',
    'Wash your face or hands with cool water.', 'Eat something nourishing, even something small.',
    'Open a window and take three easy breaths.', 'Walk to the end of the street and back.',
    'Write one kind line to tomorrow you.', 'Water a plant, or look at something green for a minute.',
    'Change into something comfortable.', 'Give yourself a small smile in the mirror.'];
  var LIFT_XP_PER_DAY = 3;


  // Milestones, in plain words. Ids stay stable so saved progress keeps working.
  var BADGES = {
    first: ['First break', 'Your first calm break'],
    streak3: ['3 days in a row', 'Three days of practice in a row'],
    streak7: ['7 days in a row', 'A full week of practice'],
    streak21: ['21 days in a row', 'Three weeks: a real habit'],
    streak30: ['30 days in a row', 'A whole month of practice'],
    ten: ['Ten breaks', 'Ten calm breaks taken'],
    bigLift: ['Big lift', 'A Calm gain of +5 or more'],
    explorer: ['Explorer', 'Tried every exercise'],
    sharer: ['Shared LoosenUp', 'Shared LoosenUp with someone'],
    golden: ['Daily reminder', 'Set a daily reminder'],
    playful: ['Playful', 'Played a calm game'],
    programme: ['Finisher', 'Finished a guided programme']
  };

  var NOTES = [
    'Two minutes for you is never small.',
    'Your calm is a skill, and you just practised it.',
    'However today goes, you made a little room for yourself.',
    'Small breaks add up to steadier days.',
    'You gave your mind a soft place to land.',
    'Every break plants something good.'
  ];

  var SKUS = {
    fullbloom: { name: 'LoosenUp Plus, monthly', price: '₹149/mo or USD 4.99/mo' },
    fullbloomYear: { name: 'LoosenUp Plus, yearly', price: '₹799/yr or USD 34.99/yr' }
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
    var hi = (window.LoosenUpI18n && window.LoosenUpI18n.crisis) || [];
    for (var j = 0; j < hi.length; j++) if (hi[j].test(t)) return true;
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
      nudges: { day: null, count: 0, shown: [] }, goldenHour: null, voice: false, badges: [], purchases: [],
      games: { day: null, count: 0 }, gameBest: { pairs: null, catch: 0, bloom: 0 },
      moods: [], smallSteps: [], goodThings: [], trusted: null, sosLocation: false, jarXp: { day: null, count: 0 },
      careTeam: null, safetyPlan: null, wellbeing: [], toolXp: { day: null, count: 0 }, reframes: 0, theme: 'auto', lang: 'en', programs: {}, org: null, lessonsDone: [], chime: true, bed: 'none',
      lock: { enabled: false, salt: '', hash: '', bio: false }
    };
  }
  function load() {
    var s = freshState();
    try {
      // Carry progress over from the app's earlier names.
      var raw = window.localStorage.getItem(KEY) || window.localStorage.getItem('lightenup.v1') || window.localStorage.getItem('sunpetal.v1') || window.localStorage.getItem('brightside.v1');
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

  function breaksDone() { return state.sessions.length; }
  function isUnlocked(id) { return breaksDone() >= (TECH[id] ? TECH[id].unlockAt : 0); }

  function recommend(context) {
    var ctx = RULES[context] ? context : 'Just a quick lift';
    var stats = {};
    state.sessions.forEach(function (s) {
      var ctxs = s.contexts || [s.context];
      if (ctxs.indexOf(ctx) === -1 || !TECH[s.technique] || s.technique === 'quick') return;
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

  function joinNames(list) {
    if (list.length <= 1) return list.join('');
    return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
  }
  function recommendFor(contexts) {
    var list = (contexts || []).filter(Boolean);
    if (list.length <= 1) return recommend(list[0]);
    var recs = list.map(recommend);
    var tally = {};
    recs.forEach(function (r) { tally[r.id] = (tally[r.id] || 0) + (r.learned ? 1.5 : 1); });
    var best = recs[0];
    recs.forEach(function (r) { if (tally[r.id] > tally[best.id]) best = r; });
    var covers = list.filter(function (c, i) { return recs[i].id === best.id; });
    return { id: best.id, name: best.name, learned: best.learned,
      reason: best.reason + ' Picked for ' + joinNames(list) + (covers.length < list.length ? ', and it suits ' + joinNames(covers) + ' best.' : '.') };
  }

  function addBadge(id, list) {
    if (state.badges.indexOf(id) === -1) { state.badges.push(id); if (list) list.push(id); }
  }

  function completeSession(input) {
    var d = now();
    var dk = dayKey(d);
    var before = clampScore(input.before), after = clampScore(input.after);
    var gain = after - before;
    var r = { gain: gain, shownGain: Math.max(0, gain), before: before, after: after, rainDayUsed: false, freshRun: false,
      milestone: null, newBadges: [], unlocked: [] };

    var ctxList = (input.contexts && input.contexts.length ? input.contexts : [input.context || 'Just a quick lift']).slice(0, 8);
    state.sessions.push({ ts: d.getTime(), day: dk, technique: input.technique, context: ctxList[0], contexts: ctxList,
      before: before, after: after, gain: gain });

    // Day streak: once per calendar day; one rest day a week keeps it going.
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
    state.sessions.forEach(function (x) { tried[x.technique] = true; });
    if (CHOOSABLE.every(function (id) { return tried[id]; })) addBadge('explorer', r.newBadges);

    save();
    return r;
  }

  function clampScore(v) { v = Math.round(Number(v)); return isNaN(v) ? 5 : Math.max(1, Math.min(10, v)); }

  // Every calm break is free, always.
  function canStart(id) { return !!TECH[id]; }

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
  function setText(id, t) { var el = $(id); if (el) { el.textContent = t; if (isHindi()) translateDom(el); } }
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
    t.textContent = tr(msg);
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2800);
  }

  /* ---------- Navigation ---------- */

  var current = null;
  var TABS = ['today', 'play', 'progress', 'me'];
  var flow = { mode: 'guided', before: 5, context: null, technique: null };

  var lastTab = 'today';
  function go(name) {
    if (name === 'sounds') { calmSeg = 'sounds'; name = 'play'; }
    if (name !== 'game') stopGame();
    if (TABS.indexOf(name) !== -1) lastTab = name;
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].hidden = screens[i].getAttribute('data-screen') !== name;
    current = name;
    var isTab = TABS.indexOf(name) !== -1;
    $('tabbar').hidden = !isTab;
    var tabs = document.querySelectorAll('[data-tab]');
    for (var j = 0; j < tabs.length; j++) tabs[j].setAttribute('aria-selected', String(tabs[j].getAttribute('data-tab') === name));
    renderSeedPill();
    if (RENDER[name]) RENDER[name]();
    if (isHindi()) translateDom(document.body);
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  }

  function renderSeedPill() { /* Seeds were retired in 2.0; kept as a no-op for older call sites. */ }

  /* ---------- Sheets ---------- */

  var lastFocus = null;
  function openSheet(id) {
    closeSheets(true);
    lastFocus = document.activeElement;
    $('scrim').hidden = false;
    var sh = $(id);
    sh.hidden = false;
    if (isHindi()) translateDom(sh);
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
    state.plan = 'fullbloom';
    state.purchases.push({ sku: sku, ts: now().getTime(), demo: true });
    save();
    renderSeedPill();
    if (RENDER[current]) RENDER[current]();
    closeSheets();
    toast('Welcome to LoosenUp Plus (demo). Every programme is open.');
  }
  function openSupport(editing) {
    renderSos(editing);
    renderOrg();
    openSheet('support-sheet');
    if (editing && $('trusted-name').focus) $('trusted-name').focus();
  }

  /* ---------- Check-in and pick ---------- */

  var CALM_WORDS = ['', 'A bit tangled', 'A bit tangled', 'A little tense', 'Somewhere in the middle', 'Somewhere in the middle',
    'Fairly settled', 'Fairly calm', 'Calm', 'Very calm', 'Wonderfully calm'];
  function bindSlider(id) {
    var el = $(id);
    var sky = $(id + '-sky');
    var last = null;
    var upd = function () {
      var v = +el.value;
      setText(id + '-out', el.value);
      setText(id + '-word', CALM_WORDS[v] || '');
      // The sky clears as calm rises: rain and heavy clouds at 1, clouds parting in the middle,
      // the petal sun up and glowing at 10. CSS reads --v (0 to 1).
      var t = ((v - 1) / 9).toFixed(3);
      if (sky) sky.style.setProperty('--v', t);
      el.style.setProperty('--fill', (t * 100).toFixed(1) + '%');
      if (last !== null && last !== v) {
        var out = $(id + '-out');
        if (out) { out.classList.remove('pop'); void out.offsetWidth; out.classList.add('pop'); }
        haptic('light');
      }
      last = v;
    };
    el.addEventListener('input', upd);
    el.addEventListener('change', upd);
    upd();
    return upd;
  }

  function activeTab() { return flow.spaceTab || flow.space || 'everyday'; }
  function renderContextChips() {
    // Every feeling stays in the DOM; only the active space's group is visible.
    var tabs = $('space-tabs');
    tabs.textContent = '';
    SPACE_ORDER.forEach(function (k) {
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'space-tab';
      t.setAttribute('role', 'tab');
      t.setAttribute('data-space-tab', k);
      t.setAttribute('aria-selected', String(k === activeTab()));
      var n = SPACES[k].contexts.filter(function (c) { return (flow.contexts || []).indexOf(c) !== -1; }).length;
      t.textContent = SPACES[k].name + (n ? ' \u00b7 ' + n : '');
      tabs.appendChild(t);
    });
    var box = $('context-chips');
    box.textContent = '';
    SPACE_ORDER.forEach(function (k) {
      var group = document.createElement('div');
      group.className = 'context-group';
      group.setAttribute('data-group', k);
      group.hidden = k !== activeTab();
      var chips = document.createElement('div');
      chips.className = 'chips';
      SPACES[k].contexts.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.setAttribute('data-context', c);
        b.setAttribute('aria-pressed', String((flow.contexts || []).indexOf(c) !== -1));
        b.textContent = c;
        chips.appendChild(b);
      });
      group.appendChild(chips);
      box.appendChild(group);
    });
    renderPicked();
    setText('checkin-step', 'Step 1 of 3' + (flow.space ? ' \u00b7 ' + SPACES[flow.space].name : ''));
  }
  function renderPicked() {
    var list = flow.contexts || [];
    var tray = $('picked-tray');
    tray.textContent = '';
    tray.hidden = !list.length;
    list.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'picked-chip';
      b.setAttribute('data-unpick', c);
      b.setAttribute('aria-label', 'Remove ' + c);
      b.textContent = c + '  \u00d7';
      tray.appendChild(b);
    });
    setText('context-count', list.length > 1 ? list.length + ' picked' : '');
    var tabs = document.querySelectorAll('[data-space-tab]');
    for (var i = 0; i < tabs.length; i++) {
      var k = tabs[i].getAttribute('data-space-tab');
      var n = SPACES[k].contexts.filter(function (c) { return list.indexOf(c) !== -1; }).length;
      tabs[i].textContent = SPACES[k].name + (n ? ' \u00b7 ' + n : '');
    }
  }
  function toggleContext(ctx) {
    flow.contexts = flow.contexts || [];
    var at = flow.contexts.indexOf(ctx);
    if (at === -1) flow.contexts.push(ctx); else flow.contexts.splice(at, 1);
    flow.context = flow.contexts[0] || null;
    var chip = document.querySelector('[data-context="' + ctx + '"]');
    if (chip) chip.setAttribute('aria-pressed', String(at === -1));
    renderPicked();
    haptic('light');
  }

  // Haptics: native taps on the phone apps, a tiny vibration on Android browsers.
  function haptic(kind) {
    try {
      var H = isNative() && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
      if (H) {
        if (kind === 'success') H.notification({ type: 'SUCCESS' });
        else H.impact({ style: kind === 'medium' ? 'MEDIUM' : 'LIGHT' });
      } else if (navigator.vibrate && /Android/i.test(navigator.userAgent || '')) {
        navigator.vibrate(kind === 'success' ? [12, 40, 12] : 8);
      }
    } catch (e) { /* haptics are a nicety */ }
  }

  function startCheckin(mode, space) {
    flow = { mode: mode, before: 5, context: null, contexts: [], technique: mode === 'quick' ? 'quick' : null, space: space || null, spaceTab: space || null };
    $('calm-before').value = '5';
    $('calm-before').dispatchEvent(new Event('input'));
    go('checkin');
  }

  function renderPick() {
    var rec = flow.picked ? null : recommendFor(flow.contexts);
    if (rec) { flow.technique = rec.id; flow.reason = rec.reason; }
    var t = TECH[flow.technique];
    setText('pick-name', t.name);
    setText('pick-desc', t.desc);
    setText('pick-reason', flow.reason);
    setText('pick-meta', Math.round(t.seconds / 60) + ' minutes');
    $('pick-card').style.setProperty('--badge', t.color);
    var box = $('pick-chips');
    box.textContent = '';
    var sps = (flow.contexts && flow.contexts.length ? flow.contexts : [flow.context]).map(spaceOf);
    CHOOSABLE.forEach(function (id) {
      var tsp = TECH[id].space || 'everyday';
      if (tsp !== 'everyday' && sps.indexOf(tsp) === -1 && id !== flow.technique) return;
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
    var label = 'Begin';
    setText('pick-begin', label);
    renderGuide();
  }

  function beginBreak(id) {
    if (!canStart(id)) return 'unknown';
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
    $('orb-petals').style.transitionDuration = '0s';
    $('orb-petals').style.transform = 'scale(0.55)';
    setText('session-kicker', t.free ? 'Always free' : 'Guided break');
    speak(INTRO[t.kind] || INTRO.breath);
    speak(t.desc, true);
    if (state.bed && state.bed !== 'none' && !audio) { sessionBed = playSound(state.bed, 0.35); }
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
    speak(ph[0], true);
    chime();
    var orb = $('orb');
    var pet = $('orb-petals');
    if (prefersReducedMotion()) { orb.style.transform = ''; pet.style.transform = ''; return; }
    orb.style.transitionDuration = ph[1] + 's';
    pet.style.transitionDuration = ph[1] + 's';
    clearTimeout(orbTimer);
    orbTimer = setTimeout(function () {
      orb.style.transform = 'scale(' + ph[2] + ')';
      // Petals open wide and turn a little on the in-breath, fold in on the out-breath.
      pet.style.transform = 'scale(' + (ph[2] >= 1 ? 1.02 : 0.55) + ') rotate(' + (ph[2] >= 1 ? 18 : 0) + 'deg)';
    }, 30);
  }

  function showStep(i) {
    var t = TECH[run.id];
    run.step = i;
    setText('step-count', 'Step ' + (i + 1) + ' of ' + t.steps.length);
    setText('step-text', t.steps[i]);
    speak(t.steps[i], true);
    if (i > 0) chime();
    $('step-next').hidden = i >= t.steps.length - 1;
    var orb = $('orb');
    if (!prefersReducedMotion()) {
      orb.style.transitionDuration = '1.2s'; orb.style.transform = 'scale(' + (0.7 + 0.06 * i) + ')';
      $('orb-petals').style.transitionDuration = '1.2s'; $('orb-petals').style.transform = 'scale(' + (0.6 + 0.09 * i) + ') rotate(' + (i * 14) + 'deg)';
    }
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
    stopVoice();
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
    if (sessionBed) { stopSound(false); sessionBed = false; }
    speak(OUTRO);
  }

  function togglePause() {
    if (!run) return;
    run.paused = !run.paused;
    setText('session-pause', run.paused ? 'Resume' : 'Pause');
    $('session-pause').setAttribute('aria-pressed', String(run.paused));
    if (run.paused) stopVoice();
  }

  var chimeCtx = null;
  var chimesPlayed = 0;
  function chime() {
    if (!state.chime) return false;
    var AC = window.AudioContext || window.webkitAudioContext;
    chimesPlayed++;
    if (!AC) return false;
    try {
      chimeCtx = chimeCtx || new AC();
      var t0 = chimeCtx.currentTime;
      [528, 792].forEach(function (f, i) {
        var o = chimeCtx.createOscillator(), g = chimeCtx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(i ? 0.025 : 0.05, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.6);
        o.connect(g); g.connect(chimeCtx.destination);
        o.start(t0); o.stop(t0 + 1.7);
      });
      return true;
    } catch (e) { return false; }
  }
  var sessionBed = false;
  function renderGuide() {
    var g = document.querySelectorAll('[data-guide]');
    for (var i = 0; i < g.length; i++) {
      var k = g[i].getAttribute('data-guide');
      g[i].setAttribute('aria-pressed', String(k === 'voice' ? !!state.voice : !!state.chime));
    }
    var b = document.querySelectorAll('[data-bed]');
    for (var j = 0; j < b.length; j++) b[j].setAttribute('aria-pressed', String(b[j].getAttribute('data-bed') === (state.bed || 'none')));
  }

  function canSpeak() { return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function'; }
  // Recorded voice: clips of a real human voice in www/voice/<lang>/<id>.m4a, listed in
  // www/voice/manifest.json. Lines without a clip fall back to the device voice.
  var voiceClips = null;
  var voiceQueue = [];
  var voiceAudio = null;
  function loadVoiceClips() {
    if (typeof fetch !== 'function') return Promise.resolve(null);
    return fetch('voice/manifest.json').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) { voiceClips = m && m.lines && m.have ? m : null; return voiceClips; })
      .catch(function () { return null; });
  }
  function clipFor(text) {
    if (!voiceClips) return null;
    var id = voiceClips.lines[text], lang = state.lang === 'hi' ? 'hi' : 'en';
    return id && (voiceClips.have[lang] || []).indexOf(id) !== -1 ? 'voice/' + lang + '/' + id + '.m4a' : null;
  }
  function deviceUtterance(text) {
    var u = new window.SpeechSynthesisUtterance(tr(text));
    u.rate = 0.9; u.pitch = 1.05;
    u.lang = state.lang === 'hi' ? 'hi-IN' : 'en-IN';
    return u;
  }
  function stopVoice() {
    voiceQueue = [];
    if (voiceAudio) { try { voiceAudio.pause(); } catch (e) { /* already stopped */ } voiceAudio = null; }
    if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) { /* no voice */ } }
  }
  function playNextVoice() {
    if (voiceAudio || !voiceQueue.length) return;
    var text = voiceQueue.shift(), src = clipFor(text);
    var next = function () { voiceAudio = null; playNextVoice(); };
    if (src && typeof window.Audio === 'function') {
      var a = new window.Audio(src);
      voiceAudio = a;
      a.onended = next;
      a.onerror = function () { voiceAudio = null; if (canSpeak()) { var u = deviceUtterance(text); u.onend = next; window.speechSynthesis.speak(u); } else next(); };
      var p = a.play();
      if (p && p.catch) p.catch(a.onerror);
    } else if (canSpeak()) {
      voiceAudio = { pause: function () {} };
      var u = deviceUtterance(text);
      u.onend = next;
      window.speechSynthesis.speak(u);
    } else next();
  }
  function speak(text, queue) {
    if (!state.voice) return;
    if (voiceClips) {
      // Recorded clips and device voice share one queue so lines never overlap.
      if (!queue) stopVoice();
      voiceQueue.push(text);
      playNextVoice();
      return;
    }
    if (!canSpeak()) return;
    try {
      if (!queue) window.speechSynthesis.cancel();
      window.speechSynthesis.speak(deviceUtterance(text));
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
    var r = completeSession({ technique: flow.technique || 'quick', context: flow.context || 'Just a quick lift', contexts: flow.contexts, before: before, after: after });
    completeProgramDay(r);
    renderResult(r);
    go('result');
    haptic('success');
  }

  function weekStats() {
    var wk = weekKey(now());
    var ses = state.sessions.filter(function (x) { return weekKey(new Date(x.ts)) === wk; });
    var avg = ses.length ? Math.round(10 * ses.reduce(function (a, x) { return a + Math.max(0, x.gain); }, 0) / ses.length) / 10 : 0;
    return { n: ses.length, avg: avg };
  }
  function renderResult(r) {
    var name = state.name || 'friend';
    setText('result-headline', r.gain > 0 ? 'Lovely, ' + name + '!' : 'You showed up, ' + name + '.');
    var g = $('result-gain');
    g.textContent = signed(r.shownGain);
    g.setAttribute('aria-label', signed(r.shownGain) + ' Calm gain');
    setText('result-change', 'From ' + r.before + ' to ' + r.after + ' out of 10');
    var ws = weekStats();
    setText('result-streak', plural(state.streak.count, 'day in a row', 'days in a row'));
    setText('result-week', plural(ws.n, 'break this week', 'breaks this week'));
    setText('result-avg', signed(ws.avg) + ' average Calm gain');
    var items = [];
    if (r.gain <= 0) items.push('You showed up, and that counts.');
    if (r.rainDayUsed) items.push('A rest day kept your streak going.');
    if (r.freshRun) items.push('A fresh streak starts today.');
    if (r.milestone) items.push(plural(r.milestone, 'day in a row', 'days in a row') + '! Milestone reached.');
    if (r.programNote) items.push(r.programNote);
    r.newBadges.forEach(function (b) { if (b !== 'first' || breaksDone() === 1) items.push('Milestone: ' + BADGES[b][0]); });
    var ul = $('result-rewards');
    ul.textContent = '';
    items.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    ul.hidden = !items.length;
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
    return { Mornings: 'Good morning, ', Afternoons: 'Good afternoon, ', Evenings: 'Good evening, ', 'Quiet nights': 'Quiet night, ' }[b] + name;
  }

  var PETAL = 'M0-44C17-52 18-78 0-94-18-78-17-52 0-44Z';
  function addPetals(parent, cx, cy, scale, cls) {
    for (var i = 0; i < 10; i++) {
      var g = svg('g', { transform: 'translate(' + cx + ' ' + cy + ') rotate(' + (i * 36) + ') scale(' + scale + ')' }, parent);
      var pth = svg('path', { d: PETAL, fill: i % 2 ? '#FFB088' : '#FFC857' }, g);
      if (cls) { pth.setAttribute('class', cls); pth.style.setProperty('--i', String(i)); }
    }
  }
  function renderSky() {
    var d = now();
    var b = bucketOf(d.getTime());
    var card = $('today-sky');
    card.setAttribute('data-time', b);
    // The sun travels an arc from 6:00 to 20:00.
    var hrs = d.getHours() + d.getMinutes() / 60;
    var t = Math.max(0, Math.min(1, (hrs - 6) / 14));
    // The sun stays in the right-hand part of the sky so it never sits behind the greeting.
    card.style.setProperty('--sx', (70 + t * 18).toFixed(1) + '%');
    card.style.setProperty('--sy', (34 - Math.sin(t * Math.PI) * 16).toFixed(1) + '%');
    setText('today-date', d.toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' }));
    setText('today-sky-streak', state.sessions.length
      ? plural(state.streak.count, 'day in a row', 'days in a row') + ' · ' + plural(state.sessions.length, 'break', 'breaks')
      : 'Your first break is two minutes away');
  }

  function renderToday() {
    renderProgramCard();
    renderSky();
    setText('today-title', greeting());
    var ws = weekStats();
    setText('today-streak', state.streak.count ? String(state.streak.count) : '0');
    setText('today-week', String(ws.n));
    setText('today-avg', signed(ws.avg));
    var wk = weekKey(now());
    setText('today-rain', state.rainDayWeek === wk ? 'This week\'s rest day is already used.' : 'One rest day a week keeps your streak going.');
    var ul = $('today-recent');
    ul.textContent = '';
    var recent = state.sessions.slice(-3).reverse();
    if (!recent.length) {
      var li0 = document.createElement('li');
      li0.textContent = 'Your breaks will appear here.';
      ul.appendChild(li0);
    }
    recent.forEach(function (s) {
      var li = document.createElement('li');
      var a = document.createElement('span');
      a.textContent = (TECH[s.technique] ? TECH[s.technique].name : 'Break') + ', ' + (s.contexts || [s.context]).join(' + ');
      var g = document.createElement('span');
      g.className = 'g';
      g.textContent = signed(Math.max(0, s.gain)) + ' Calm gain';
      li.appendChild(a); li.appendChild(g);
      ul.appendChild(li);
    });
    renderGoldenBanner();
    renderMood();
    renderSupportCard();
    renderSteps();
    renderJar();
    $('check-due').hidden = !checkDue();
  }

  function todayMood() {
    var dk = dayKey(now());
    for (var i = 0; i < state.moods.length; i++) if (state.moods[i].day === dk) return state.moods[i].mood;
    return null;
  }
  function setMood(n) {
    var dk = dayKey(now());
    var found = false;
    state.moods.forEach(function (m) { if (m.day === dk) { m.mood = n; found = true; } });
    if (!found) state.moods.push({ day: dk, mood: n });
    if (state.moods.length > 400) state.moods = state.moods.slice(-400);
    save();
    renderMood();
    renderSupportCard();
    renderSeedPill();
    if (n === 1) openSheet('safety-sheet');
  }
  function renderMood() {
    var m = todayMood();
    var btns = document.querySelectorAll('[data-mood]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(+btns[i].getAttribute('data-mood') === m));
    var scale = document.querySelector('.mood-scale');
    if (scale) { scale.setAttribute('data-level', String(m || 0)); scale.style.setProperty('--lv', String(m ? (m - 1) / 4 : 0)); }
    var moods = document.querySelector('.moods');
    if (moods) moods.classList.toggle('has-pick', !!m);
    setText('mood-done', m ? MOOD_NOTES[m] : 'One tap is enough. Every answer is welcome here.');
    var mem = $('jar-memory');
    if (m && m <= 2 && state.goodThings.length) {
      var g = state.goodThings[Math.floor(rng() * state.goodThings.length)];
      mem.textContent = 'From your Good things jar: "' + g.text + '"';
      mem.hidden = false;
    } else mem.hidden = true;
  }
  function heavyStretch() {
    // Three check-ins in a row on consecutive days, all heavy, the latest today or yesterday.
    var ms = state.moods.slice().sort(function (a, b) { return a.day < b.day ? -1 : 1; }).slice(-3);
    if (ms.length < 3) return false;
    for (var i = 0; i < 3; i++) if (ms[i].mood > 2) return false;
    if (daysBetween(ms[0].day, ms[1].day) !== 1 || daysBetween(ms[1].day, ms[2].day) !== 1) return false;
    return daysBetween(ms[2].day, dayKey(now())) <= 1;
  }
  function renderSupportCard() { $('support-card').hidden = !heavyStretch(); }

  var stepOffset = 0;
  function currentStep() { return STEPS[(dayNum(dayKey(now())) + stepOffset) % STEPS.length]; }
  function renderSteps() {
    setText('step-idea', currentStep());
    var dk = dayKey(now());
    var today = state.smallSteps.filter(function (x) { return x.day === dk; }).length;
    setText('steps-note', today ? plural(today, 'small step', 'small steps') + ' today. Each one counts.' : 'Tiny actions count, and each one lifts your day a little.');
  }
  function doStep() {
    var dk = dayKey(now());
    var today = state.smallSteps.filter(function (x) { return x.day === dk; }).length;
    state.smallSteps.push({ day: dk, step: currentStep() });
    var xp = today < LIFT_XP_PER_DAY;
    if (xp) state.xp += 3;
    save();
    stepOffset++;
    renderSteps();
    renderSeedPill();
    haptic('success');
    toast('Lovely. That small step counts.');
  }
  function renderJar() {
    var n = state.goodThings.length;
    setText('jar-count', n ? plural(n, 'good thing', 'good things') + ' saved in your jar.' : 'Your jar is ready. Today\'s first good thing can be tiny.');
  }
  function openJar() {
    $('good-text').value = '';
    openSheet('jar-sheet');
    var t = $('good-text');
    if (t.focus) t.focus();
  }
  function onGoodInput() {
    if (isCrisis($('good-text').value)) { $('good-text').value = ''; openSupport(); }
  }
  function saveGood() {
    var text = ($('good-text').value || '').trim().replace(/\s+/g, ' ').slice(0, 160);
    if (!text) { toast('Write a word or two first.'); return; }
    if (isCrisis(text)) { $('good-text').value = ''; openSupport(); return; }
    state.goodThings.push({ day: dayKey(now()), text: text });
    if (state.goodThings.length > 200) state.goodThings = state.goodThings.slice(-200);
    var dk = dayKey(now());
    if (state.jarXp.day !== dk) state.jarXp = { day: dk, count: 0 };
    var xp = state.jarXp.count < LIFT_XP_PER_DAY;
    if (xp) { state.jarXp.count++; state.xp += 2; }
    save();
    $('good-text').value = '';
    closeSheets();
    renderJar();
    renderSeedPill();
    toast('Saved in your jar.');
  }

  /* ---------- SOS ---------- */

  function sosHref(loc) {
    var t = state.trusted;
    if (!t) return '#';
    var body = 'Hi ' + t.name + ', it is ' + (state.name && state.name !== 'friend' ? state.name : 'me') +
      '. I am having a really hard time and could really use you right now. Can you call me or come be with me?';
    if (loc) body += ' I am here: https://maps.google.com/?q=' + loc.lat.toFixed(5) + ',' + loc.lon.toFixed(5);
    body = tr(body);
    return 'sms:' + t.phone + '?&body=' + encodeURIComponent(body);
  }
  function renderSos(editing) {
    var t = state.trusted;
    var a = $('sos-alert');
    a.hidden = !t;
    if (t) { a.textContent = 'Message ' + t.name + ' now'; a.setAttribute('href', sosHref(null)); }
    $('sos-location').hidden = !t;
    setText('sos-location', 'Add my location to the message: ' + (state.sosLocation ? 'on' : 'off'));
    $('sos-location').setAttribute('aria-pressed', String(!!state.sosLocation));
    $('trusted-setup').hidden = !!t && !editing;
    $('trusted-edit').hidden = !t || !!editing;
    if (editing && t) { $('trusted-name').value = t.name; $('trusted-phone').value = t.phone; }
  }
  function saveTrusted() {
    var name = ($('trusted-name').value || '').trim().slice(0, 40);
    var phone = ($('trusted-phone').value || '').replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    if (phone.replace(/\D/g, '').length < 6) { toast('Add their phone number, with the country code if you can.'); return; }
    state.trusted = { name: name || 'my trusted person', phone: phone };
    save();
    renderSos(false);
    if (current === 'me') renderMe();
    toast('Saved. SOS can now message ' + state.trusted.name + ' in one tap.');
  }
  function sendSos(e) {
    if (!state.trusted) return;
    if (!state.sosLocation || !navigator.geolocation) return; // the link opens the messaging app as it is
    e.preventDefault();
    var go2 = function (loc) { window.location.href = sosHref(loc); };
    navigator.geolocation.getCurrentPosition(function (pos) { go2({ lat: pos.coords.latitude, lon: pos.coords.longitude }); },
      function () { go2(null); }, { timeout: 6000, maximumAge: 60000 });
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

  // Small seeded random numbers for stable layouts.
  function seeded(i) {
    var t = (i + 1) * 0x6D2B79F5;
    return function () {
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function renderMilestones() {
    var ul = $('badges');
    ul.textContent = '';
    Object.keys(BADGES).forEach(function (id) {
      var li = document.createElement('li');
      var has = state.badges.indexOf(id) !== -1;
      if (!has) li.className = 'dim';
      var st = document.createElement('strong');
      st.textContent = BADGES[id][0];
      var sp = document.createElement('span');
      sp.textContent = has ? BADGES[id][1] : 'Not yet: ' + BADGES[id][1].toLowerCase();
      li.appendChild(st); li.appendChild(sp);
      ul.appendChild(li);
    });
  }
  function renderProgress() {
    var all = state.sessions;
    setText('prog-streak', String(state.streak.count || 0));
    setText('prog-best', 'Best: ' + plural(state.streak.best || 0, 'day', 'days'));
    setText('prog-total', String(all.length));
    var avg = all.length ? Math.round(10 * all.reduce(function (a, x) { return a + Math.max(0, x.gain); }, 0) / all.length) / 10 : 0;
    setText('prog-avg', signed(avg));
    var wb = state.wellbeing && state.wellbeing.length ? state.wellbeing[state.wellbeing.length - 1] : null;
    setText('prog-wb', wb ? wb.score + ' / 100' : 'Not yet');
    setText('prog-wb-note', wb ? wellbeingNote(wb.score).split('. ')[0] + '.' : 'Take the two-week check below.');
    renderWeek();
    renderMilestones();
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
    // Mood line: 1 (very heavy) low on the chart to 5 (bright) high.
    var moodBy = {};
    state.moods.forEach(function (m) { moodBy[m.day] = m.mood; });
    var pts = [];
    days.forEach(function (d, i) { if (moodBy[d.key]) pts.push([18 + i * 45 + 16, 140 - (moodBy[d.key] - 1) * 28, moodBy[d.key]]); });
    if (pts.length > 1) svg('polyline', { points: pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' '), fill: 'none', stroke: '#F28F6B', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', opacity: 0.85 }, c);
    pts.forEach(function (p) { svg('circle', { 'class': 'mood-dot', cx: p[0], cy: p[1], r: 5.5, fill: '#fff', stroke: '#F28F6B', 'stroke-width': 3 }, c); });
    var ins = insights();
    setText('insight-tech', ins.tech);
    setText('insight-time', ins.time);
    setText('insight-mood', moodInsight(days.map(function (d) { return moodBy[d.key]; }).filter(Boolean)));
  }

  function moodInsight(ms) {
    if (ms.length < 3) return 'Check in with your mood each day and your trend will appear here as a coral line.';
    var half = Math.floor(ms.length / 2);
    var avg = function (a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; };
    var earlier = avg(ms.slice(0, half)), recent = avg(ms.slice(-half));
    if (recent - earlier >= 0.5) return 'Your days have been getting lighter this week. Lovely to see.';
    if (earlier - recent >= 0.5) return 'This week has felt heavier. Small steps, Kind words and SOS are all here for you.';
    return 'Your mood has been steady this week. Small breaks keep it that way.';
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
    renderOrg();
    setText('me-title', state.name ? state.name + '\'s corner' : 'Your corner');
    setText('me-plan', state.plan === 'fullbloom' ? 'LoosenUp Plus (demo): every programme, every day.' : 'Free: every calm break, tool and SOS, always.');
    if (state.goldenHour) $('golden-time').value = state.goldenHour;
    $('golden-clear').hidden = !state.goldenHour;
    setText('golden-help', state.goldenHour
      ? 'Daily reminder set for ' + state.goldenHour + '. ' + (isNative() ? 'One gentle reminder arrives each day.' : 'A gentle note appears in the app from that time.')
      : (isNative() ? 'Pick a daily time for one gentle reminder.' : 'Pick a daily time and a gentle note will appear in the app. The phone apps can send one daily reminder.'));
    renderVoiceButtons();
    renderInstall();
    renderLockCard();
    setText('me-trusted', state.trusted ? 'Trusted person: ' + state.trusted.name + ' (' + state.trusted.phone + '). SOS can message them in one tap.'
      : 'Add a trusted person so SOS can message them in one tap.');
    setText('open-trusted', state.trusted ? 'Change my trusted person' : 'Set up my trusted person');
  }

  var RENDER = { programs: renderPrograms, program: renderProgram, learn: renderLearn, support: renderSupport, safety: renderSafety, reframe: startReframe, sounds: function () {}, wellbeing: renderWellbeing,
    today: renderToday, play: renderPlay, progress: renderProgress, me: renderMe, pick: renderPick, checkin: renderContextChips };

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
          id: 1, title: 'LoosenUp', body: tr('Two calm minutes are here for you whenever you like.'),
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
    toast('Daily reminder set for ' + v + '.');
  }
  function clearGoldenHour() {
    state.goldenHour = null;
    save();
    scheduleGoldenHour();
    renderMe();
    toast('Daily reminder is off. You can set it again any time.');
  }

  function shareUrl() { return /^https?:$/.test(location.protocol) && !isNative() && location.hostname !== 'localhost' ? location.origin : PUBLIC_URL; }
  function shareSunbeam() {
    var url = shareUrl();
    var text = 'Two calm minutes that help me feel lighter. Try LoosenUp. Android: ' + ANDROID_URL + '  iPhone: ' + IOS_URL;
    var rewardShare = function () {
      addBadge('sharer');
      state.referralDay = dayKey(now());
      save();
      toast('Thank you for sharing LoosenUp.');
    };
    var copy = function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(function () { toast('Link copied. Share it anywhere you like.'); rewardShare(); },
          function () { toast('Share this link: ' + url); });
      }
      toast('Share this link: ' + url);
      return Promise.resolve();
    };
    if (navigator.share) {
      return navigator.share({ title: 'LoosenUp', text: text }).then(rewardShare, function (e) {
        if (e && e.name === 'AbortError') return;
        return copy();
      });
    }
    return copy();
  }

  var installEvt = null;
  function isStandalone() { return mm('(display-mode: standalone)') || window.navigator.standalone === true || isNative(); }
  function isIosSafari() {
    var ua = navigator.userAgent || '';
    var ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    return ios && !/CriOS|FxiOS|EdgiOS/.test(ua);
  }
  function renderIosTip() { $('ios-tip').hidden = !(isIosSafari() && !isStandalone()); }

  function renderInstall() {
    var card = $('install-card');
    if (isNative()) { card.hidden = true; return; }
    card.hidden = false;
    var ua = navigator.userAgent || '';
    var ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    $('install-btn').hidden = !installEvt;
    if (isStandalone()) setText('install-text', 'LoosenUp is installed. Lovely to have you here.');
    else if (installEvt) setText('install-text', 'Add LoosenUp to your home screen for quick, offline breaks.');
    else if (ios) setText('install-text', 'On iPhone: open loosenup-ios.anchit-tandon.com in Safari, tap Share, then Add to Home Screen.');
    else setText('install-text', 'On Android: open the Chrome menu, then Install app. On iPhone: Safari Share, then Add to Home Screen.');
  }

  function registerSW() {
    if (!('serviceWorker' in navigator) || isNative() || !/^https?:$/.test(location.protocol)) return;
    var reg = function () { navigator.serviceWorker.register('/sw.js').catch(function () { /* offline support is optional */ }); };
    if (document.readyState === 'complete') reg(); else window.addEventListener('load', reg);
  }

  /* ---------- Play: calm mini-games (every round ends kindly) ---------- */

  var GAMES = {
    pairs: { name: 'Calm Pairs', help: 'Turn two cards at a time. Matching pairs stay open. Take all the time you like.' },
    catch: { name: 'Sunbeam Catch', help: 'Tap the sunbeams and petals as they drift by. Every catch fills your jar.' },
    bloom: { name: 'Breathing Ring', help: 'Press and hold while the ring grows to breathe in. Let go as it shrinks to breathe out. Six slow breaths.' }
  };
  var FLOWERS = [['Bright sun', '#FFC857'], ['Moon', '#B9A3F0'], ['Cloud', '#8CC8F0'], ['Wave', '#4FA9C8'], ['Star', '#FFB088'], ['Heart', '#F28FA0']];
  var game = null;

  /* ---------- Guided programmes (LoosenUp Plus after the free days) ---------- */
  // One day opens per calendar day. Each day is a short tip plus one exercise.
  var PROGRAM_FREE_DAYS = 3;
  var PROGRAMS = {
    sleep: { id: 'sleep', name: 'Better sleep in 21 days', color: '#8CA9F0', space: 'sleep',
      desc: 'A gentle 21 day plan for falling asleep more easily and waking up fresher.',
      days: [
        ['Set your anchor', 'Pick one wake time and keep it all week, even on weekends. Tonight, just notice when you feel sleepy.', 'breeze'],
        ['Dim the last hour', 'One hour before bed, lower the lights and the screen brightness. Dim light tells your body it is time to rest.', 'release'],
        ['Park your thoughts', 'Write tomorrow\'s top three tasks on paper before bed, so your mind can set them down.', 'letitout'],
        ['A cool, quiet room', 'Make the room a little cooler and darker tonight. Small changes add up.', 'breeze'],
        ['Long breaths out', 'In bed, breathe out for longer than you breathe in, for a few slow rounds.', 'sigh'],
        ['Tea and coffee earlier', 'Try no tea or coffee after 2pm today and notice how the evening feels.', 'here'],
        ['Look back kindly', 'Notice one night this week that went a little better. What helped?', 'kind'],
        ['Morning light', 'Get ten minutes of daylight soon after waking. It helps set your body clock.', 'breeze'],
        ['The bed is for sleep', 'If you have been awake in bed for a long while, get up and do something calm in dim light, then return.', 'release'],
        ['Soften the body', 'Relax each part of the body, from shoulders to toes, as you lie down.', 'release'],
        ['Screens down', 'Put the phone to charge out of reach of the bed tonight.', 'breeze'],
        ['A worry window', 'Give your thoughts ten minutes on paper in the early evening, so they are not saved for bedtime.', 'letitout'],
        ['Gentle movement', 'A short walk or stretch during the day can make sleep come more easily.', 'here'],
        ['Halfway there', 'Two weeks in. Notice what has changed, even slightly.', 'kind'],
        ['Same time, every day', 'Keep the wake time steady, even after a short night. Your body learns the rhythm.', 'breeze'],
        ['Lighter dinners', 'Try finishing dinner two to three hours before bed.', 'sigh'],
        ['A wind down ritual', 'Choose three calm steps for every night, like washing up, a soft sound and slow breathing.', 'release'],
        ['If you wake at night', 'Keep the lights low, skip the clock, and return to slow breathing.', 'breeze'],
        ['Naps with care', 'If you nap, keep it short and before mid afternoon.', 'here'],
        ['Kind words at night', 'Speak to yourself gently tonight, the way you would to a tired friend.', 'kind'],
        ['Your sleep plan', 'Pick the three habits that helped most and keep them. You did this.', 'sigh']
      ] },
    exam: { id: 'exam', name: 'Exam calm', color: '#FFC857', space: 'everyday',
      desc: 'Two weeks of focus, steady breathing and kind self-talk for students.',
      days: [
        ['Map the next two weeks', 'Write every exam date and topic on one page, so it lives on paper, not in your head.', 'letitout'],
        ['Study in rounds', 'Try 25 minutes of focus, then a 5 minute break away from the screen.', 'desk'],
        ['Breathe before you start', 'Before each study round, take one steady square breath.', 'square'],
        ['Sleep is study time', 'Your memory sorts what you learned while you sleep. Protect at least seven hours.', 'breeze'],
        ['One topic at a time', 'When the list feels long, pick only the next small topic.', 'square'],
        ['Move a little', 'A ten minute walk between study rounds can refresh your focus.', 'here'],
        ['Talk to yourself kindly', 'Swap "I will never get this" for "I am still learning this."', 'kind'],
        ['Practise like the real thing', 'Do one past paper with a timer, then rest.', 'square'],
        ['Fuel and water', 'Keep water nearby and eat regular meals. Your brain runs on them.', 'here'],
        ['When your mind goes blank', 'Put the pen down, take a long breath out, and read the question again slowly.', 'sigh'],
        ['Ask for help early', 'Message a teacher or a friend about one topic you are unsure of.', 'kind'],
        ['Phone in another room', 'Keep the phone out of the room during study rounds.', 'desk'],
        ['The night before', 'Light revision only, pack your things, and wind down early.', 'breeze'],
        ['Exam morning', 'Eat something, reach the hall with time to spare, and take three slow breaths before you begin.', 'sigh']
      ] },
    burnout: { id: 'burnout', name: 'Recovering from burnout', color: '#9ED3C4', space: 'work',
      desc: 'Three weeks to rebuild your energy, set clear limits and rest well.',
      days: [
        ['Name what drains you', 'Write down the three things that take the most energy from you right now.', 'letitout'],
        ['One real break', 'Take one break today away from all screens, even for five minutes.', 'desk'],
        ['A clear end to the day', 'Choose a time to stop work today, and close the laptop then.', 'release'],
        ['Sleep first', 'Protect your sleep tonight. Recovery starts there.', 'breeze'],
        ['Say no to one thing', 'Turn down or postpone one task that can wait.', 'pause'],
        ['Move your body', 'Ten minutes of walking or stretching today.', 'here'],
        ['Notice the small wins', 'Write one thing you handled well this week.', 'kind'],
        ['One task at a time', 'Work on one task for an hour with notifications off.', 'square'],
        ['Lunch away from the desk', 'Eat one meal today without a screen.', 'desk'],
        ['Ask for what you need', 'Tell your manager or a colleague one thing that would help.', 'pause'],
        ['Reconnect', 'Spend time with someone who leaves you feeling lighter.', 'warmth'],
        ['Your energy map', 'Notice the hours when you feel most awake, and plan focused work there.', 'here'],
        ['Slow mornings', 'Start the day without email for the first 30 minutes.', 'breeze'],
        ['Halfway check', 'Compare today with day one. What feels a little lighter?', 'kind'],
        ['Limits in writing', 'Put your working hours on your calendar and your status.', 'pause'],
        ['Something just for you', 'Do one thing today purely because you enjoy it.', 'here'],
        ['Soften the body', 'Let your shoulders and jaw go soft a few times today.', 'release'],
        ['Rest is part of the work', 'Treat rest as part of your job, not a reward for finishing it.', 'breeze'],
        ['Talk it through', 'If heavy days keep coming, talking to a counsellor can really help. Find support lists real options.', 'kind'],
        ['Plan next week', 'Put two short breaks a day into next week\'s calendar.', 'desk'],
        ['Keep what works', 'Choose three habits from these weeks to keep going.', 'sigh']
      ] }
  };
  var PROGRAM_ORDER = ['sleep', 'exam', 'burnout'];
  var currentProgram = null;
  function progState(id) { return (state.programs || {})[id] || null; }
  // Which day (1 based) the person is on, and whether it can be done today.
  function programStatus(id) {
    var p = PROGRAMS[id], ps = progState(id), total = p.days.length;
    if (!ps) return { started: false, day: 1, total: total, doneToday: false, finished: false, locked: false };
    var done = ps.done.length;
    var finished = done >= total;
    var doneToday = ps.lastDay === dayKey(now());
    var day = finished ? total : done + 1;
    var locked = !finished && day > PROGRAM_FREE_DAYS && state.plan !== 'fullbloom';
    return { started: true, day: day, total: total, done: done, doneToday: doneToday, finished: finished, locked: locked };
  }
  function activeProgram() {
    for (var i = 0; i < PROGRAM_ORDER.length; i++) {
      var st = programStatus(PROGRAM_ORDER[i]);
      if (st.started && !st.finished) return PROGRAM_ORDER[i];
    }
    return null;
  }
  function renderPrograms() {
    var box = $('program-list');
    box.textContent = '';
    PROGRAM_ORDER.forEach(function (id) {
      var p = PROGRAMS[id], st = programStatus(id);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'program-card';
      b.setAttribute('data-program', id);
      b.style.setProperty('--c', p.color);
      var h = document.createElement('strong'); h.textContent = p.name;
      var d = document.createElement('span'); d.className = 'program-desc'; d.textContent = p.desc;
      var m = document.createElement('span'); m.className = 'program-meta';
      m.textContent = st.finished ? 'Completed' : st.started ? 'Day ' + st.day + ' of ' + st.total : st.total + ' days · first ' + PROGRAM_FREE_DAYS + ' free';
      var bar = document.createElement('span'); bar.className = 'program-bar';
      var fill = document.createElement('i'); fill.style.width = Math.round(100 * (st.done || 0) / st.total) + '%';
      bar.appendChild(fill);
      b.appendChild(h); b.appendChild(d); b.appendChild(m); b.appendChild(bar);
      box.appendChild(b);
    });
  }
  function openProgram(id) {
    if (!PROGRAMS[id]) return;
    currentProgram = id;
    go('program');
  }
  function renderProgram() {
    var id = currentProgram || activeProgram() || 'sleep';
    currentProgram = id;
    var p = PROGRAMS[id], st = programStatus(id);
    $('screen-program').style.setProperty('--c', p.color);
    setText('program-name', p.name);
    setText('program-desc', p.desc);
    var day = p.days[st.day - 1];
    setText('program-day-label', st.finished ? 'All ' + st.total + ' days done' : 'Day ' + st.day + ' of ' + st.total);
    setText('program-day-title', st.finished ? 'You finished ' + p.name : day[0]);
    setText('program-day-tip', st.finished ? 'Keep the habits that helped. You can start again any time.' : day[1]);
    setText('program-day-tech', st.finished ? '' : 'Today\'s practice: ' + TECH[day[2]].name);
    var btn = $('program-start');
    btn.hidden = false;
    if (st.finished) setText('program-start', 'Start again');
    else if (st.doneToday) { btn.hidden = true; }
    else if (st.locked) setText('program-start', 'Unlock with LoosenUp Plus');
    else setText('program-start', st.started ? 'Start today\'s practice' : 'Start day 1');
    $('program-wait').hidden = !(st.doneToday && !st.finished);
    setText('program-wait', 'Done for today. Day ' + st.day + ' opens tomorrow.');
    $('program-paywall').hidden = state.plan === 'fullbloom';
    var dots = $('program-days');
    dots.textContent = '';
    for (var i = 1; i <= st.total; i++) {
      var s = document.createElement('span');
      var done = st.started && i <= (st.done || 0);
      var isToday = !st.finished && i === st.day;
      var paid = i > PROGRAM_FREE_DAYS && state.plan !== 'fullbloom';
      s.className = 'pday' + (done ? ' done' : '') + (isToday ? ' today' : '') + (paid && !done ? ' paid' : '');
      s.textContent = String(i);
      s.setAttribute('aria-label', 'Day ' + i + (done ? ', done' : isToday ? ', today' : paid ? ', LoosenUp Plus' : ''));
      dots.appendChild(s);
    }
  }
  function startProgramDay() {
    var id = currentProgram, p = PROGRAMS[id], st = programStatus(id);
    if (st.finished) { state.programs[id] = null; delete state.programs[id]; save(); renderProgram(); return 'restart'; }
    if (st.doneToday) return 'wait';
    if (st.locked) { openShop('Day ' + (PROGRAM_FREE_DAYS + 1) + ' onwards of every programme is part of LoosenUp Plus.'); return 'shop'; }
    if (!state.programs) state.programs = {};
    if (!state.programs[id]) state.programs[id] = { started: dayKey(now()), done: [], lastDay: null };
    save();
    var tech = p.days[st.day - 1][2];
    startCheckin('guided', TECH[tech].space || null);
    flow.technique = tech; flow.picked = true; flow.chosen = true; flow.program = { id: id, day: st.day };
    flow.reason = 'Day ' + st.day + ' of ' + p.name + '.';
    return 'started';
  }
  // Called when a break finishes. Marks the programme day done (once per calendar day).
  function completeProgramDay(r) {
    var pr = flow.program;
    flow.program = null;
    if (!pr || !state.programs || !state.programs[pr.id]) return;
    var ps = state.programs[pr.id];
    var dk = dayKey(now());
    if (ps.lastDay === dk || ps.done.indexOf(pr.day) !== -1) return;
    ps.done.push(pr.day);
    ps.lastDay = dk;
    state.xp += 5;
    var total = PROGRAMS[pr.id].days.length;
    r.programNote = ps.done.length >= total ? 'You finished ' + PROGRAMS[pr.id].name + '!' : 'Day ' + pr.day + ' of ' + total + ' done.';
    if (ps.done.length >= total) addBadge('programme', r.newBadges);
    save();
  }
  function renderProgramCard() {
    var id = activeProgram(), card = $('program-today');
    if (!card) return;
    card.hidden = !id;
    if (!id) return;
    var p = PROGRAMS[id], st = programStatus(id);
    card.style.setProperty('--c', p.color);
    card.setAttribute('data-program', id);
    setText('program-today-name', p.name);
    setText('program-today-day', st.doneToday ? 'Day ' + st.done + ' of ' + st.total + ' done. See you tomorrow.' : 'Day ' + st.day + ' of ' + st.total + ': ' + p.days[st.day - 1][0]);
  }

  /* ---------- Organisations: join code, anonymous weekly pulse, support line ---------- */
  // The app only ever sends weekly averages, and only after the person turns sharing on.
  var ORG_API = 'https://loosenup-ios.anchit-tandon.com/api/org';
  function orgCall(body) {
    if (typeof fetch !== 'function') return Promise.reject(new Error('offline'));
    return fetch(ORG_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Please try again.'); return j; }); });
  }
  function randomId() {
    var a = new Uint8Array(18);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(a);
    else for (var i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256);
    return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  // A week's averages, from what is already on this phone.
  function weekPulse(week) {
    var ses = state.sessions.filter(function (x) { return weekKey(new Date(x.ts)) === week; });
    var moods = state.moods.filter(function (m) { return weekKey(new Date(m.day + 'T12:00:00')) === week; });
    if (!ses.length && !moods.length) return null;
    var avg = function (a) { return a.length ? Math.round(10 * a.reduce(function (x, y) { return x + y; }, 0) / a.length) / 10 : null; };
    var count = {};
    ses.forEach(function (x) { (x.contexts || [x.context]).forEach(function (c) { if (c) count[c] = (count[c] || 0) + 1; }); });
    var top = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; }).slice(0, 3);
    return { week: week, mood: avg(moods.map(function (m) { return m.mood; })), calmGain: avg(ses.map(function (x) { return x.gain; })), breaks: ses.length, contexts: top };
  }
  // Sends last week's pulse once, if sharing is on and there is something to share.
  function sendPulse() {
    var o = state.org;
    if (!o || !o.share) return Promise.resolve(false);
    var week = weekKey(new Date(now().getTime() - 7 * 86400000));
    if (o.sentWeek === week) return Promise.resolve(false);
    var p = weekPulse(week);
    if (!p) return Promise.resolve(false);
    p.action = 'pulse'; p.code = o.code; p.member = o.member;
    return orgCall(p).then(function () { state.org.sentWeek = week; save(); return true; }).catch(function () { return false; });
  }
  function joinOrg(code) {
    code = String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length < 6) { setText('org-status', 'Add the join code from your organisation.'); return Promise.resolve(false); }
    setText('org-status', 'Checking the code...');
    return orgCall({ action: 'join', code: code }).then(function (j) {
      state.org = { code: j.joinCode, name: j.name, kind: j.kind, supportName: j.supportName || null, supportPhone: j.supportPhone || null, share: false, member: randomId(), sentWeek: null };
      save();
      renderOrg();
      setText('org-status', 'You joined ' + j.name + '.');
      return true;
    }).catch(function (e) { setText('org-status', e.message === 'offline' ? 'Connect to the internet to join.' : e.message); return false; });
  }
  function toggleOrgShare() {
    if (!state.org) return;
    state.org.share = !state.org.share;
    save();
    renderOrg();
    if (state.org.share) sendPulse();
  }
  function leaveOrg() { state.org = null; save(); renderOrg(); setText('org-status', 'You left the organisation.'); }
  function renderOrg() {
    var o = state.org;
    if (!$('org-card')) return;
    $('org-join').hidden = !!o;
    $('org-joined').hidden = !o;
    if (o) {
      setText('org-name', o.name);
      setText('org-share', 'Share an anonymous weekly pulse: ' + (o.share ? 'on' : 'off'));
      $('org-share').setAttribute('aria-pressed', String(!!o.share));
    }
    var sos = $('sos-org');
    sos.hidden = !(o && o.supportPhone);
    if (o && o.supportPhone) {
      sos.href = 'tel:' + o.supportPhone.replace(/\s/g, '');
      setText('sos-org', 'Call ' + (o.supportName || o.name) + ' (' + o.supportPhone + ')');
    }
  }

  /* ---------- Real services: book online, or in person in your city ---------- */
  // The list lives in www/partners.js (checked on official sites). Location is used only on
  // this phone to sort nearby places; it is never sent anywhere.
  var partnerFilter = 'all';
  var inPerson = { city: null, here: null };
  function partners() { return window.LoosenUpPartners || { online: [], offline: [] }; }
  function mk(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function partnerMatches(p, f) {
    if (f === 'free') return /^Free/.test(p.price);
    if (f === 'therapy') return /Counselling|Psychology|helpline/i.test(p.type) && !/^AI/.test(p.type);
    if (f === 'psychiatry') return /psychiatry/i.test(p.type);
    if (f === 'hindi') return (p.languages || []).indexOf('Hindi') !== -1;
    return true;
  }
  function renderPartners() {
    var box = $('partner-list');
    if (!box) return;
    box.textContent = '';
    var list = partners().online.filter(function (p) { return partnerMatches(p, partnerFilter); });
    list.forEach(function (p) {
      var c = mk('article', 'partner');
      var head = mk('div', 'partner-head');
      var nm = mk('strong', null, p.name); nm.setAttribute('data-no-tr', '');
      head.appendChild(nm);
      head.appendChild(mk('span', 'partner-type', p.type));
      c.appendChild(head);
      c.appendChild(mk('p', 'partner-desc', p.desc));
      var meta = mk('p', 'partner-meta');
      meta.appendChild(mk('span', 'partner-price', p.price));
      if (p.modes && p.modes.length) meta.appendChild(mk('span', null, p.modes.map(function (m) { return m.charAt(0).toUpperCase() + m.slice(1); }).join(' · ')));
      c.appendChild(meta);
      if (p.languages && p.languages.length) c.appendChild(mk('p', 'fine', p.languages.join(', ')));
      if (p.rating) { var r = mk('p', 'fine partner-rating', p.rating); r.setAttribute('data-no-tr', ''); c.appendChild(r); }
      var a = mk('a', 'btn btn-soft', /^Free/.test(p.price) && /helpline/i.test(p.type) ? 'Open their site' : 'Book on their site');
      a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
      c.appendChild(a);
      box.appendChild(c);
    });
    if (!list.length) box.appendChild(mk('p', 'muted', 'Nothing matches that filter yet.'));
    setText('partner-note', 'LoosenUp is not paid by these services. Details were checked on their official sites on ' + partners().checked + '; confirm prices before you book.');
    var chips = document.querySelectorAll('[data-pfilter]');
    for (var i = 0; i < chips.length; i++) chips[i].setAttribute('aria-pressed', String(chips[i].getAttribute('data-pfilter') === partnerFilter));
  }
  function km(a, b) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function cities() { var s = []; partners().offline.forEach(function (o) { if (s.indexOf(o.city) === -1) s.push(o.city); }); return s; }
  function nearestCity(here) {
    var best = null;
    partners().offline.forEach(function (o) { var d = km(here, o); if (!best || d < best.d) best = { city: o.city, d: d }; });
    return best;
  }
  function renderInPerson() {
    var sel = $('inperson-city');
    if (!sel) return;
    if (!sel.options.length) {
      var none = mk('option', null, 'Choose a city'); none.value = ''; sel.appendChild(none);
      cities().forEach(function (c) { var o = mk('option', null, c); o.value = c; sel.appendChild(o); });
    }
    sel.value = inPerson.city || '';
    var box = $('inperson-list');
    box.textContent = '';
    if (!inPerson.city) return;
    var here = inPerson.here;
    var list = partners().offline.filter(function (o) { return o.city === inPerson.city; })
      .map(function (o) { return { o: o, d: here ? km(here, o) : null }; })
      .sort(function (a, b) { return a.d == null ? 0 : a.d - b.d; });
    list.forEach(function (x) {
      var o = x.o, c = mk('article', 'partner');
      var head = mk('div', 'partner-head');
      var nm = mk('strong', null, o.name); nm.setAttribute('data-no-tr', '');
      head.appendChild(nm);
      head.appendChild(mk('span', 'partner-type', o.type));
      c.appendChild(head);
      var ad = mk('p', 'partner-desc', o.address); ad.setAttribute('data-no-tr', ''); c.appendChild(ad);
      var meta = mk('p', 'partner-meta');
      meta.appendChild(mk('span', 'partner-price', o.cost));
      if (x.d != null) meta.appendChild(mk('span', null, (x.d < 10 ? x.d.toFixed(1) : Math.round(x.d)) + ' km away'));
      c.appendChild(meta);
      var row = mk('div', 'partner-actions');
      if (o.phone) { var call = mk('a', 'btn btn-soft', 'Call'); call.href = 'tel:' + o.phone.replace(/[^\d+]/g, ''); row.appendChild(call); }
      var dir = mk('a', 'btn btn-soft', 'Directions');
      dir.href = isIos() ? 'https://maps.apple.com/?daddr=' + o.lat + ',' + o.lon : 'https://www.google.com/maps/dir/?api=1&destination=' + o.lat + ',' + o.lon;
      dir.target = '_blank'; dir.rel = 'noopener'; row.appendChild(dir);
      var site = mk('a', 'btn btn-ghost', 'Website'); site.href = o.url; site.target = '_blank'; site.rel = 'noopener'; row.appendChild(site);
      c.appendChild(row);
      box.appendChild(c);
    });
  }
  function setCity(city) { inPerson.city = city || null; renderInPerson(); }
  function locateInPerson() {
    if (!navigator.geolocation) { setText('inperson-status', 'Location is not available here. Choose a city instead.'); return; }
    setText('inperson-status', 'Finding places near you...');
    navigator.geolocation.getCurrentPosition(function (pos) {
      var here = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      useLocation(here);
    }, function () { setText('inperson-status', 'Location is off. Choose a city instead.'); }, { timeout: 10000, maximumAge: 600000 });
  }
  function useLocation(here) {
    var n = nearestCity(here);
    inPerson.here = here;
    if (n && n.d < 120) { setText('inperson-status', 'Showing ' + n.city + ', nearest first.'); setCity(n.city); }
    else { setText('inperson-status', 'No listed city is close by yet. The map search below finds options near you.'); setCity(null); }
  }

  /* ---------- Calm: breathing, games and sounds in one screen ---------- */
  var SEGS = ['breathe', 'games', 'sounds'];
  var calmSeg = 'breathe';
  var BREATH_LIST = ['quick', 'sigh', 'breeze', 'square', 'cooldown'];
  var MIND_LIST = ['here', 'release', 'letitout', 'kind', 'desk', 'pause', 'warmth'];
  function setSeg(seg, focus) {
    if (SEGS.indexOf(seg) === -1) seg = 'breathe';
    calmSeg = seg;
    var bar = document.querySelector('#screen-play .seg');
    if (!bar) return;
    bar.setAttribute('data-active', seg);
    SEGS.forEach(function (k) {
      var on = k === seg;
      $('seg-' + k).setAttribute('aria-selected', String(on));
      $('seg-' + k).tabIndex = on ? 0 : -1;
      $('panel-' + k).hidden = !on;
    });
    if (focus) $('seg-' + seg).focus();
  }
  function stepSeg(dir) {
    var i = SEGS.indexOf(calmSeg) + dir;
    if (i >= 0 && i < SEGS.length) { setSeg(SEGS[i], true); haptic('light'); }
  }
  function practiceCard(id) {
    var t = TECH[id];
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'practice' + (id === 'quick' ? ' featured' : '');
    b.setAttribute('data-practice', id);
    b.style.setProperty('--c', t.color);
    var orb = document.createElement('span'); orb.className = 'practice-orb'; orb.setAttribute('aria-hidden', 'true');
    var body = document.createElement('span'); body.className = 'practice-body';
    var nm = document.createElement('strong'); nm.textContent = t.name;
    var ds = document.createElement('span'); ds.className = 'practice-desc'; ds.textContent = t.desc;
    var meta = document.createElement('span'); meta.className = 'practice-meta';
    if (!isUnlocked(id)) {
      b.disabled = true;
      meta.textContent = 'Opens in ' + plural(TECH[id].unlockAt - breaksDone(), 'more break', 'more breaks');
    } else if (id === 'quick') meta.textContent = '1 min · Always free';
    else meta.textContent = Math.round(t.seconds / 60) + ' min' + (t.space ? ' · ' + SPACES[t.space].name : '');
    body.appendChild(nm); body.appendChild(ds); body.appendChild(meta);
    b.appendChild(orb); b.appendChild(body);
    return b;
  }
  function renderPractice() {
    [['practice-breath', BREATH_LIST], ['practice-mind', MIND_LIST]].forEach(function (g) {
      var box = $(g[0]);
      box.textContent = '';
      g[1].forEach(function (id) { box.appendChild(practiceCard(id)); });
    });
  }
  function startPractice(id) {
    if (!TECH[id] || !isUnlocked(id)) return;
    if (id === 'quick') { startCheckin('quick'); flow.chosen = true; return; }
    startCheckin('guided', TECH[id].space || null);
    flow.technique = id; flow.picked = true; flow.chosen = true; flow.reason = 'You picked this one yourself.';
  }
  function bindCalmGestures() {
    var bar = document.querySelector('#screen-play .seg');
    bar.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); stepSeg(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); stepSeg(-1); }
    });
    var scr = $('screen-play'), x0 = null, y0 = 0;
    scr.addEventListener('touchstart', function (e) {
      var t = e.target;
      x0 = t.closest && t.closest('input, .seg') ? null : e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    scr.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) stepSeg(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  function renderPlay() {
    renderPractice();
    setSeg(calmSeg);
    var dk = dayKey(now());
    var played = state.games.day === dk ? state.games.count : 0;
    setText('play-note', played ? 'Play as long as you like. There is nothing to rush.' : 'Short, gentle games for a busy mind.');
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function openGame(id) {
    stopGame();
    game = { id: id, timers: [], done: false };
    setText('game-title', GAMES[id].name);
    setText('game-help', GAMES[id].help);
    setText('game-score', '');
    $('game-done').hidden = true;
    var stage = $('game-stage');
    stage.textContent = '';
    go('game');
    ({ pairs: startPairs, catch: startCatch, bloom: startBloom })[id](stage);
  }

  function stopGame() {
    if (!game) return;
    game.timers.forEach(function (t) { clearInterval(t); clearTimeout(t); });
    if (game.raf && window.cancelAnimationFrame) window.cancelAnimationFrame(game.raf);
    game = null;
  }

  function finishGame(title, text, best) {
    if (!game || game.done) return;
    game.done = true;
    game.timers.forEach(function (t) { clearInterval(t); clearTimeout(t); });
    var dk = dayKey(now());
    if (state.games.day !== dk) state.games = { day: dk, count: 0 };
    var rewarded = state.games.count < DAILY_GAME_REWARDS;
    if (rewarded) { state.games.count++; state.xp += GAME_XP; }
    var nb = [];
    addBadge('playful', nb);
    if (best) best();
    save();
    renderSeedPill();
    setText('game-done-title', title);
    setText('game-done-text', text);
    $('game-done').hidden = false;
    var again = $('game-again');
    if (again && again.focus) again.focus();
  }

  // Calm Pairs: a gentle memory match.
  // Calm Pairs card faces: simple calm symbols (sun, moon, cloud, wave, star, heart).
  var SYMBOL_PATHS = [
    'M20 11a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM20 3v4M20 33v4M3 20h4M33 20h4M8 8l3 3M29 29l3 3M8 32l3-3M29 11l3-3',
    'M25 7a13 13 0 1 0 8 23 11 11 0 0 1-8-23z',
    'M12 29a7 7 0 0 1 0-14 9 9 0 0 1 17-2 7 7 0 0 1 0 16z',
    'M4 17c4-4 8-4 12 0s8 4 12 0 8-4 8-4M4 26c4-4 8-4 12 0s8 4 12 0 8-4 8-4',
    'M20 4l4.7 10 10.8 1.2-8 7.3 2.3 10.6L20 27.6l-9.8 5.5 2.3-10.6-8-7.3 10.8-1.2z',
    'M20 34S6 25 6 15a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 10-14 19-14 19z'
  ];
  function flowerSvg(color, kind) {
    var s0 = document.createElementNS(SVGNS, 'svg');
    s0.setAttribute('viewBox', '0 0 40 40');
    s0.setAttribute('aria-hidden', 'true');
    var stroke = kind === 0 || kind === 3;
    svg('path', { d: SYMBOL_PATHS[kind || 0], fill: stroke ? (kind === 0 ? color : 'none') : color, stroke: color, 'stroke-width': stroke ? 3 : 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s0);
    return s0;
  }
  function startPairs(stage) {
    var deck = shuffle([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]).map(function (k) { return { kind: k, open: false, done: false }; });
    game.deck = deck;
    game.moves = 0;
    game.openIdx = [];
    var grid = document.createElement('div');
    grid.className = 'pairs';
    deck.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pcard';
      b.setAttribute('data-card', String(i));
      b.setAttribute('aria-label', 'Card ' + (i + 1) + ', face down');
      b.appendChild(flowerSvg(FLOWERS[c.kind][1], c.kind));
      grid.appendChild(b);
    });
    stage.appendChild(grid);
    updatePairsScore();
  }
  function updatePairsScore() {
    var matched = game.deck.filter(function (c) { return c.done; }).length / 2;
    setText('game-score', matched + ' of 6 pairs');
  }
  function flipCard(i) {
    if (!game || game.id !== 'pairs' || game.done) return;
    var c = game.deck[i];
    if (!c || c.open || c.done || game.openIdx.length >= 2) return;
    c.open = true;
    game.openIdx.push(i);
    paintCard(i);
    if (game.openIdx.length === 2) {
      game.moves++;
      var a = game.deck[game.openIdx[0]], b = game.deck[game.openIdx[1]];
      if (a.kind === b.kind) {
        a.done = b.done = true; a.open = b.open = false;
        var pair = game.openIdx; game.openIdx = [];
        pair.forEach(paintCard);
        updatePairsScore();
        if (game.deck.every(function (x) { return x.done; })) {
          var moves = game.moves;
          var prev = state.gameBest.pairs;
          finishGame('All pairs matched', 'You matched 6 pairs in ' + plural(moves, 'move', 'moves') + (prev && moves < prev ? ', your best yet!' : '.'),
            function () { if (!prev || moves < prev) state.gameBest.pairs = moves; });
        }
      } else {
        var g0 = game;
        g0.timers.push(setTimeout(function () {
          if (game !== g0) return;
          g0.openIdx.forEach(function (j) { g0.deck[j].open = false; paintCard(j); });
          g0.openIdx = [];
        }, 900));
      }
    }
  }
  function paintCard(i) {
    var el = document.querySelector('[data-card="' + i + '"]');
    var c = game.deck[i];
    if (!el) return;
    el.setAttribute('data-open', String(c.open));
    el.setAttribute('data-done', String(c.done));
    el.setAttribute('aria-label', 'Card ' + (i + 1) + (c.open || c.done ? ', ' + FLOWERS[c.kind][0] + (c.done ? ', matched' : '') : ', face down'));
  }

  // Sunbeam Catch: tap what drifts by. Nothing is ever dropped or counted against you.
  var CATCH_SECONDS = 45;
  function startCatch(stage) {
    var field = document.createElement('div');
    field.className = 'catch-field';
    field.id = 'catch-field';
    var jar = document.createElement('p');
    jar.className = 'jar';
    jar.id = 'catch-jar';
    field.appendChild(jar);
    stage.appendChild(field);
    game.caught = 0;
    game.left = CATCH_SECONDS;
    game.beams = [];
    updateCatch();
    game.timers.push(setInterval(function () {
      if (!game || game.done) return;
      game.left--;
      updateCatch();
      if (game.left <= 0) endCatch();
    }, 1000));
    game.timers.push(setInterval(spawnBeam, 850));
    spawnBeam();
    var last = 0;
    var step = function (ts) {
      if (!game || game.id !== 'catch' || game.done) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      game.beams.forEach(function (bm) {
        if (bm.caught) return;
        bm.y += bm.v * dt;
        bm.x += Math.sin((ts / 1000) * bm.w) * 0.05;
        bm.el.style.top = bm.y.toFixed(2) + '%';
        bm.el.style.left = bm.x.toFixed(2) + '%';
        if (bm.y > 112) { bm.caught = true; if (bm.el.parentNode) bm.el.parentNode.removeChild(bm.el); }
      });
      game.beams = game.beams.filter(function (bm) { return !bm.caught || bm.el.parentNode; });
      game.raf = window.requestAnimationFrame ? window.requestAnimationFrame(step) : 0;
    };
    if (window.requestAnimationFrame && !prefersReducedMotion()) game.raf = window.requestAnimationFrame(step);
  }
  function updateCatch() {
    setText('game-score', plural(game.caught, 'sunbeam', 'sunbeams'));
    setText('catch-jar', 'In your jar: ' + game.caught + (game.left > 0 ? '   ' + Math.floor(game.left / 60) + ':' + pad(game.left % 60) : ''));
  }
  function spawnBeam() {
    if (!game || game.id !== 'catch' || game.done) return null;
    var field = $('catch-field');
    var petal = rng() < 0.4;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'beam';
    b.setAttribute('aria-label', petal ? 'Catch a petal' : 'Catch a sunbeam');
    var icon = document.createElementNS(SVGNS, 'svg');
    icon.setAttribute('viewBox', '0 0 40 40');
    if (petal) svg('path', { d: 'M20 6C30 12 30 28 20 34 10 28 10 12 20 6Z', fill: '#FFB088' }, icon);
    else {
      svg('circle', { cx: 20, cy: 20, r: 15, fill: '#FFE29A', opacity: 0.6 }, icon);
      svg('circle', { cx: 20, cy: 20, r: 9, fill: '#FFC857' }, icon);
    }
    b.appendChild(icon);
    var bm = { el: b, x: 10 + rng() * 80, y: prefersReducedMotion() ? 15 + rng() * 70 : -8, v: 9 + rng() * 7, w: 0.6 + rng(), caught: false };
    b.style.left = bm.x + '%';
    b.style.top = bm.y + '%';
    b.addEventListener('click', function () { catchBeam(bm); });
    field.appendChild(b);
    game.beams.push(bm);
    if (prefersReducedMotion()) {
      game.timers.push(setTimeout(function () { if (!bm.caught && b.parentNode) { bm.caught = true; b.parentNode.removeChild(b); } }, 3000));
    }
    return b;
  }
  function catchBeam(bm) {
    if (!game || game.done || bm.caught) return;
    bm.caught = true;
    game.caught++;
    bm.el.classList.add('caught');
    setTimeout(function () { if (bm.el.parentNode) bm.el.parentNode.removeChild(bm.el); }, 450);
    updateCatch();
  }
  function endCatch() {
    var n = game.caught;
    var prev = state.gameBest.catch || 0;
    finishGame('Your jar is glowing', 'You caught ' + plural(n, 'sunbeam', 'sunbeams') + (n > prev && prev > 0 ? ', your brightest jar yet!' : '.'),
      function () { if (n > prev) state.gameBest.catch = n; });
  }

  // Breathing Ring: hold to breathe in with the ring, let go to breathe out.
  var BLOOM_IN = 4, BLOOM_OUT = 4, BLOOM_ROUNDS = 6;
  function startBloom(stage) {
    var wrap = document.createElement('div');
    wrap.className = 'bloom-stage';
    var ring = document.createElement('div');
    ring.className = 'bloom-ring';
    var guide = document.createElement('div');
    guide.className = 'bloom-guide';
    guide.id = 'bloom-guide';
    var fl = document.createElementNS(SVGNS, 'svg');
    fl.setAttribute('viewBox', '-100 -100 200 200');
    fl.setAttribute('class', 'bloom-flower');
    fl.id = 'bloom-flower';
    addPetals(fl, 0, 0, 1);
    svg('circle', { r: 40, fill: 'url(#g-sun)' }, fl);
    ring.appendChild(guide);
    ring.appendChild(fl);
    var cue = document.createElement('p');
    cue.className = 'cue';
    cue.id = 'bloom-cue';
    cue.textContent = 'Press and hold to begin';
    var hold = document.createElement('button');
    hold.type = 'button';
    hold.className = 'bloom-hold';
    hold.id = 'bloom-hold';
    hold.setAttribute('aria-pressed', 'false');
    hold.textContent = 'Hold to breathe in';
    var row = document.createElement('div');
    row.className = 'bloom-row';
    row.id = 'bloom-row';
    row.setAttribute('aria-label', 'Flowers bloomed');
    wrap.appendChild(ring); wrap.appendChild(cue); wrap.appendChild(hold); wrap.appendChild(row);
    stage.appendChild(wrap);
    game.holding = false;
    game.started = false;
    game.round = 0;
    game.phaseT = 0;
    game.inSync = 0;
    game.samples = 0;
    var down = function (e) { if (e) e.preventDefault(); setHold(true); };
    var up = function () { setHold(false); };
    hold.addEventListener('pointerdown', down);
    hold.addEventListener('pointerup', up);
    hold.addEventListener('pointerleave', up);
    hold.addEventListener('pointercancel', up);
    hold.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); setHold(true); } });
    hold.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setHold(false); } });
    hold.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    setText('game-score', '0 of ' + BLOOM_ROUNDS + ' breaths');
  }
  function setHold(on) {
    if (!game || game.id !== 'bloom' || game.done) return;
    game.holding = on;
    var hold = $('bloom-hold');
    hold.setAttribute('aria-pressed', String(on));
    hold.textContent = on ? 'Breathing in...' : 'Hold to breathe in';
    $('bloom-flower').style.transform = on ? 'scale(1)' : 'scale(0.45)';
    $('bloom-flower').style.transitionDuration = on ? BLOOM_IN + 's' : '1.2s';
    if (on && !game.started) {
      game.started = true;
      bloomPhase();
      game.timers.push(setInterval(bloomTick, 100));
    }
  }
  function bloomPhase() {
    var inhale = game.phaseT < BLOOM_IN;
    setText('bloom-cue', inhale ? 'Breathe in' : 'Breathe out');
    var g = $('bloom-guide');
    g.style.transitionDuration = (inhale ? BLOOM_IN : BLOOM_OUT) + 's';
    g.style.transform = inhale ? 'scale(1)' : 'scale(0.5)';
    speak(inhale ? 'Breathe in' : 'Breathe out');
  }
  function bloomTick() {
    if (!game || game.id !== 'bloom' || game.done) return;
    var wasIn = game.phaseT < BLOOM_IN;
    game.phaseT += 0.1;
    var inhale = game.phaseT < BLOOM_IN;
    game.samples++;
    if (inhale === game.holding) game.inSync++;
    if (wasIn && !inhale) bloomPhase();
    if (game.phaseT >= BLOOM_IN + BLOOM_OUT) {
      game.phaseT = 0;
      bloomRound();
      if (game && !game.done) bloomPhase();
    }
  }
  function bloomRound() {
    game.round++;
    var row = $('bloom-row');
    var f = document.createElementNS(SVGNS, 'svg');
    f.setAttribute('viewBox', '0 0 40 40');
    miniFlower(f, 20, 20, 12, FLOWERS[(game.round - 1) % FLOWERS.length][1]);
    row.appendChild(f);
    setText('game-score', game.round + ' of ' + BLOOM_ROUNDS + ' breaths');
    if (game.round >= BLOOM_ROUNDS) endBloom();
  }
  function endBloom() {
    var pct = game.samples ? Math.round(game.inSync / game.samples * 100) : 0;
    var prev = state.gameBest.bloom || 0;
    finishGame('Six slow breaths', 'You moved with the ring ' + pct + '% of the time. Every breath counted.',
      function () { if (pct > prev) state.gameBest.bloom = pct; });
  }
  function finishCurrentGame() {
    if (!game) return;
    if (game.id === 'pairs') {
      game.deck.forEach(function (c, i) { c.done = true; c.open = false; paintCard(i); });
      updatePairsScore();
      finishGame('All pairs matched', 'You matched 6 pairs in ' + plural(game.moves, 'move', 'moves') + '.');
    } else if (game.id === 'catch') endCatch();
    else endBloom();
  }


  /* ---------- Toolkit: support, safety plan, reframe, sounds, wellbeing, backup ---------- */

  var TOOL_SCREENS = ['support', 'safety', 'reframe', 'wellbeing'];
  function toolXp(points) {
    var dk = dayKey(now());
    if (state.toolXp.day !== dk) state.toolXp = { day: dk, count: 0 };
    if (state.toolXp.count >= 3) return false;
    state.toolXp.count++;
    state.xp += points;
    return true;
  }
  function isIos() {
    var ua = navigator.userAgent || '';
    return /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  }

  // Find support
  var DEFAULT_PROS = 'Tele-MANAS 14416 (24x7, free)\nVandrevala Foundation +91 9999 666 555 (24x7, call or WhatsApp)\niCall 022-25521111 (Mon to Sat, 8am to 9pm)\nEmergency 112';
  function renderSupport() {
    var links = document.querySelectorAll('[data-near]');
    for (var i = 0; i < links.length; i++) {
      var q = links[i].getAttribute('data-near') + ' near me';
      links[i].setAttribute('href', isIos() ? 'https://maps.apple.com/?q=' + encodeURIComponent(q) : 'https://www.google.com/maps/search/' + encodeURIComponent(q).replace(/%20/g, '+'));
    }
    renderCare(false);
    renderPartners();
    renderInPerson();
  }
  function renderCare(editing) {
    var c = state.careTeam;
    $('care-view').hidden = !c || editing;
    $('care-form').hidden = !!c && !editing;
    if (c) {
      setText('care-name', c.name);
      setText('care-role', c.role);
      $('care-call').setAttribute('href', 'tel:' + c.phone);
      $('care-call').hidden = !c.phone;
      var when = c.next ? new Date(c.next) : null;
      setText('care-next', when && !isNaN(when) ? 'Next session: ' + when.toLocaleString(locale(), { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'No session booked yet.');
      if (editing) {
        $('care-name-input').value = c.name; $('care-role-input').value = c.role;
        $('care-phone-input').value = c.phone; $('care-next-input').value = c.next || '';
      }
    }
  }
  function saveCare() {
    var name = ($('care-name-input').value || '').trim().slice(0, 60);
    if (!name) { toast('Add their name first.'); return; }
    var phone = ($('care-phone-input').value || '').replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    state.careTeam = { name: name, role: $('care-role-input').value || 'Therapist', phone: phone, next: $('care-next-input').value || '' };
    save();
    renderCare(false);
    scheduleCareReminder();
    toast('Saved to your care team.');
  }
  function scheduleCareReminder() {
    var LN = nativeNotifications();
    var c = state.careTeam;
    if (!LN || !c || !c.next) return;
    var at = new Date(new Date(c.next).getTime() - 60 * 60 * 1000);
    if (isNaN(at) || at <= now()) return;
    LN.cancel({ notifications: [{ id: 2 }] }).catch(function () {}).then(function () {
      return LN.schedule({ notifications: [{ id: 2, title: tr('Your session is in an hour'), body: tr(c.name + ' at ' + new Date(c.next).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + '. You are doing something kind for yourself.'), schedule: { at: at } }] });
    }).catch(function () {});
  }
  function copyScript() {
    var t = $('first-call-script').textContent;
    var ok = function () { toast('Copied. Paste it into a message or keep it handy for the call.'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, function () { toast('Hold to select the text and copy it.'); });
    else toast('Hold to select the text and copy it.');
  }

  // Safety plan
  function renderSafety() {
    var plan = state.safetyPlan || {};
    var fields = document.querySelectorAll('[data-sp]');
    for (var i = 0; i < fields.length; i++) {
      var k = fields[i].getAttribute('data-sp');
      fields[i].value = plan[k] != null ? plan[k] : (k === 'pros' ? DEFAULT_PROS : '');
    }
    setText('sp-saved', state.safetyPlan ? 'Saved on this device.' : 'Nothing is saved until you tap Save.');
  }
  function saveSafety() {
    var plan = {};
    var fields = document.querySelectorAll('[data-sp]');
    for (var i = 0; i < fields.length; i++) plan[fields[i].getAttribute('data-sp')] = (fields[i].value || '').slice(0, 1200);
    plan.updated = now().getTime();
    state.safetyPlan = plan;
    save();
    setText('sp-saved', 'Saved on this device. It is one tap away from SOS.');
    haptic('success');
    toast('Your safety plan is saved.');
  }

  // Reframe a thought: nothing is stored except an optional kinder thought.
  var rf = { step: 1 };
  function startReframe() {
    rf = { step: 1 };
    var areas = document.querySelectorAll('.rf');
    for (var i = 0; i < areas.length; i++) areas[i].value = '';
    $('rf-before').value = '6'; $('rf-after').value = '6';
    setText('rf-before-out', '6'); setText('rf-after-out', '6');
    $('rf-result').hidden = true; $('rf-keep').hidden = true; $('rf-next').hidden = false;
    showRf();
  }
  function showRf() {
    var panes = document.querySelectorAll('[data-rf]');
    for (var i = 0; i < panes.length; i++) panes[i].hidden = +panes[i].getAttribute('data-rf') !== rf.step;
    setText('rf-step', rf.step <= 5 ? 'Step ' + rf.step + ' of 5' : 'Done');
    setText('rf-next', rf.step < 5 ? 'Next' : 'Finish');
  }
  function rfNext() {
    var need = { 1: 'rf-situation', 2: 'rf-thought', 5: 'rf-kinder' }[rf.step];
    if (need && !($(need).value || '').trim()) { toast('Write a few words first. Any words are welcome.'); return; }
    if (rf.step === 5) {
      var b = +$('rf-before').value, a = +$('rf-after').value;
      rf.kinder = ($('rf-kinder').value || '').trim().slice(0, 200);
      state.reframes = (state.reframes || 0) + 1;
      var got = toolXp(3);
      save();
      setText('rf-result', a < b ? 'From ' + b + ' to ' + a + '. That is a real shift, and you made it.'
        : 'Some thoughts take a few tries. You did the work, and that counts.');
      $('rf-result').hidden = false; $('rf-keep').hidden = false; $('rf-next').hidden = true;
      var panes = document.querySelectorAll('[data-rf]');
      for (var i = 0; i < panes.length; i++) panes[i].hidden = true;
      setText('rf-step', 'Done');
      var areas = document.querySelectorAll('.rf');
      for (var j = 0; j < areas.length; j++) areas[j].value = '';
      haptic('success');
      return;
    }
    rf.step++;
    showRf();
  }
  function keepKinder() {
    if (!rf.kinder) return;
    state.goodThings.push({ day: dayKey(now()), text: 'Kinder thought: ' + rf.kinder });
    rf.kinder = '';
    save();
    $('rf-keep').hidden = true;
    toast('Kept in your Good things jar.');
  }
  function onRfInput(e) {
    if (isCrisis(e.target.value)) { e.target.value = ''; openSupport(); }
  }

  // Calm sounds, generated with Web Audio (no files, works offline).
  var audio = null;
  function noiseBuffer(ctx, brown) {
    var len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
    }
    return buf;
  }
  function soundVolume() { return Math.max(0, Math.min(1, +$('sound-volume').value / 100)) * 0.6; }
  function playSound(kind, vol) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { setText('sound-status', 'Sounds are not available on this device.'); return false; }
    stopSound(true);
    var ctx = new AC();
    var src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, kind === 'brown' || kind === 'ocean');
    src.loop = true;
    var out = ctx.createGain();
    out.gain.value = 0;
    var node = src;
    if (kind === 'rain') {
      var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6000;
      node.connect(hp); hp.connect(lp); node = lp;
    } else if (kind === 'breeze') {
      var bp = ctx.createBiquadFilter(); bp.type = 'lowpass'; bp.frequency.value = 900;
      var lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
      var depth = ctx.createGain(); depth.gain.value = 500;
      lfo.connect(depth); depth.connect(bp.frequency); lfo.start();
      node.connect(bp); node = bp;
    }
    var swell = ctx.createGain(); swell.gain.value = 1;
    if (kind === 'ocean') {
      var wave = ctx.createOscillator(); wave.frequency.value = 0.09;
      var wdepth = ctx.createGain(); wdepth.gain.value = 0.45;
      wave.connect(wdepth); wdepth.connect(swell.gain); wave.start();
    }
    node.connect(swell); swell.connect(out); out.connect(ctx.destination);
    src.start();
    out.gain.linearRampToValueAtTime(vol != null ? vol * 0.6 : soundVolume(), ctx.currentTime + 2.5);
    audio = { ctx: ctx, out: out, kind: kind, timer: null };
    var btns = document.querySelectorAll('[data-sound]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(btns[i].getAttribute('data-sound') === kind));
    setSleepTimer(currentTimer);
    setText('sound-status', 'Playing. Keep LoosenUp open while it plays.');
    return true;
  }
  function stopSound(quick) {
    if (!audio) return;
    var a = audio;
    audio = null;
    clearTimeout(a.timer);
    try {
      a.out.gain.cancelScheduledValues(a.ctx.currentTime);
      a.out.gain.setValueAtTime(a.out.gain.value, a.ctx.currentTime);
      a.out.gain.linearRampToValueAtTime(0, a.ctx.currentTime + (quick ? 0.2 : 3));
      setTimeout(function () { try { a.ctx.close(); } catch (e) { /* already closed */ } }, quick ? 300 : 3200);
    } catch (e) { /* audio already gone */ }
    var btns = document.querySelectorAll('[data-sound]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', 'false');
    setText('sound-status', 'Stopped. Tap a sound to begin again.');
  }
  var currentTimer = 0;
  function setSleepTimer(min) {
    currentTimer = min;
    var chips = document.querySelectorAll('[data-timer]');
    for (var i = 0; i < chips.length; i++) chips[i].setAttribute('aria-pressed', String(+chips[i].getAttribute('data-timer') === min));
    if (audio) {
      clearTimeout(audio.timer);
      if (min > 0) audio.timer = setTimeout(function () { stopSound(false); }, min * 60 * 1000);
    }
  }

  // Wellbeing check: WHO-5 Wellbeing Index (0 to 100).
  var WHO5 = ['I have felt cheerful and in good spirits', 'I have felt calm and relaxed', 'I have felt active and full of energy',
    'I woke up feeling fresh and rested', 'My daily life has been filled with things that interest me'];
  var WHO5_SCALE = ['At no time', 'Some of the time', 'Less than half of the time', 'More than half of the time', 'Most of the time', 'All of the time'];
  var wbAnswers = [];
  function renderWellbeing() {
    wbAnswers = [null, null, null, null, null];
    var box = $('wb-items');
    box.textContent = '';
    var legend = document.createElement('p');
    legend.className = 'fine';
    legend.textContent = '0 = at no time, 5 = all of the time';
    box.appendChild(legend);
    WHO5.forEach(function (q, qi) {
      var card = document.createElement('div');
      card.className = 'card wb-item';
      var t = document.createElement('p');
      t.className = 'field-label';
      t.textContent = (qi + 1) + '. ' + q;
      var row = document.createElement('div');
      row.className = 'wb-scale';
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', q);
      for (var v = 0; v <= 5; v++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'wb-opt';
        b.setAttribute('data-wb', qi + ':' + v);
        b.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-label', WHO5_SCALE[v]);
        b.textContent = String(v);
        row.appendChild(b);
      }
      card.appendChild(t); card.appendChild(row);
      box.appendChild(card);
    });
    $('wb-result').hidden = true;
    renderWbTrend();
  }
  function answerWb(qi, v) {
    wbAnswers[qi] = v;
    var btns = document.querySelectorAll('[data-wb^="' + qi + ':"]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(btns[i].getAttribute('data-wb') === qi + ':' + v));
  }
  function wellbeingNote(score) {
    if (score >= 72) return 'Your wellbeing looks bright. Keep the small habits that got you here.';
    if (score >= 52) return 'Steady. Calm breaks and Small steps help keep it that way.';
    if (score > 28) return 'Your wellbeing has been lower than usual. Talking to a professional can really help, and reaching out early makes a difference.';
    return 'These two weeks have been really heavy. Please consider talking to a professional soon. Tele-MANAS (14416) is free and open 24x7.';
  }
  function submitWb() {
    if (wbAnswers.some(function (a) { return a == null; })) { toast('Answer all five. Every answer is welcome.'); return; }
    var score = wbAnswers.reduce(function (x, y) { return x + y; }, 0) * 4;
    var dk = dayKey(now());
    state.wellbeing = state.wellbeing.filter(function (w) { return w.day !== dk; });
    state.wellbeing.push({ day: dk, score: score });
    toolXp(5);
    save();
    setText('wb-score', String(score));
    setText('wb-note', wellbeingNote(score));
    $('wb-support').hidden = score > 50;
    $('wb-result').hidden = false;
    renderWbTrend();
    haptic('success');
    if (score <= 28) openSupport();
  }
  function renderWbTrend() {
    var ul = $('wb-trend');
    ul.textContent = '';
    var list = state.wellbeing.slice(-6).reverse();
    if (!list.length) { var li0 = document.createElement('li'); li0.textContent = 'Your first check will appear here.'; ul.appendChild(li0); return; }
    list.forEach(function (w) {
      var li = document.createElement('li');
      var a = document.createElement('span'); a.textContent = new Date(w.day + 'T12:00:00').toLocaleDateString(locale(), { day: 'numeric', month: 'short' });
      var g = document.createElement('span'); g.className = 'g'; g.textContent = w.score + ' / 100';
      li.appendChild(a); li.appendChild(g); ul.appendChild(li);
    });
  }
  function checkDue() {
    if (breaksDone() < 2) return false;
    var last = state.wellbeing[state.wellbeing.length - 1];
    return !last || daysBetween(last.day, dayKey(now())) >= 14;
  }

  // Backup and restore
  function exportBackup() {
    var data = JSON.stringify({ app: 'LoosenUp', version: VERSION, exportedAt: now().toISOString(), state: state }, null, 2);
    var name = 'loosenup-backup-' + dayKey(now()) + '.json';
    var done = function () { setText('backup-status', 'Backup saved as ' + name + '. Keep it somewhere safe.'); };
    try {
      var file = typeof File === 'function' ? new File([data], name, { type: 'application/json' }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        return navigator.share({ files: [file], title: 'LoosenUp backup' }).then(done, function () {});
      }
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      done();
    } catch (e) { setText('backup-status', 'Could not create the file on this device.'); }
    return Promise.resolve();
  }
  function restoreBackup(text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { setText('backup-status', 'That file is not a LoosenUp backup.'); return false; }
    if (!obj || obj.app !== 'LoosenUp' || !obj.state || typeof obj.state !== 'object' || !Array.isArray(obj.state.sessions)) {
      setText('backup-status', 'That file is not a LoosenUp backup.'); return false;
    }
    try { window.localStorage.setItem(KEY + '.before-restore', JSON.stringify(state)); } catch (e) { /* storage full */ }
    var fresh = freshState();
    for (var k in fresh) if (Object.prototype.hasOwnProperty.call(obj.state, k)) fresh[k] = obj.state[k];
    state = fresh;
    save();
    setText('backup-status', 'Restored. Welcome back' + (state.name ? ', ' + state.name : '') + '.');
    renderSeedPill();
    return true;
  }
  function onImport(e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () { restoreBackup(String(r.result)); e.target.value = ''; };
    r.readAsText(f);
  }

  /* ---------- App lock ---------- */
  // Compact SHA-256 so the PIN is only ever stored as a salted hash.
  function sha256(msg) {
    function rr(n, x) { return (x >>> n) | (x << (32 - n)); }
    var K = [], H = [], primes = 0, cand = 2;
    var isPrime = function (n) { for (var f = 2; f * f <= n; f++) if (n % f === 0) return false; return true; };
    while (primes < 64) { if (isPrime(cand)) { if (primes < 8) H[primes] = (Math.pow(cand, 1 / 2) * 4294967296) | 0; K[primes] = (Math.pow(cand, 1 / 3) * 4294967296) | 0; primes++; } cand++; }
    var bytes = unescape(encodeURIComponent(msg)), l = bytes.length, words = [];
    for (var i = 0; i < l; i++) words[i >> 2] |= bytes.charCodeAt(i) << ((3 - i % 4) * 8);
    words[l >> 2] |= 0x80 << ((3 - l % 4) * 8);
    words[((l + 8) >> 6 << 4) + 15] = l * 8;
    for (var j = 0; j < words.length; j += 16) {
      var w = words.slice(j, j + 16), o = H.slice(0);
      for (var t = 0; t < 64; t++) {
        if (t >= 16) {
          var w15 = w[t - 15] | 0, w2 = w[t - 2] | 0;
          w[t] = ((w[t - 16] | 0) + (rr(7, w15) ^ rr(18, w15) ^ (w15 >>> 3)) + (w[t - 7] | 0) + (rr(17, w2) ^ rr(19, w2) ^ (w2 >>> 10))) | 0;
        }
        var e = H[4], t1 = H[7] + (rr(6, e) ^ rr(11, e) ^ rr(25, e)) + ((e & H[5]) ^ (~e & H[6])) + K[t] + (w[t] | 0);
        var a0 = H[0], t2 = (rr(2, a0) ^ rr(13, a0) ^ rr(22, a0)) + ((a0 & H[1]) ^ (a0 & H[2]) ^ (H[1] & H[2]));
        H = [(t1 + t2) | 0].concat(H); H[4] = (H[4] + t1) | 0; H.pop();
      }
      for (var q = 0; q < 8; q++) H[q] = (H[q] + o[q]) | 0;
    }
    var hex = '';
    for (var z = 0; z < 8; z++) for (var y = 3; y >= 0; y--) { var b = (H[z] >>> (y * 8)) & 255; hex += (b < 16 ? '0' : '') + b.toString(16); }
    return hex;
  }
  function randomSalt() {
    var arr = new Uint8Array(16);
    try { window.crypto.getRandomValues(arr); } catch (e) { for (var i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256); }
    return Array.prototype.map.call(arr, function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
  }
  function pinHash(pin, salt) { return sha256(salt + ':' + pin); }
  function lockEnabled() { return !!(state.lock && state.lock.enabled && state.lock.hash); }
  var lockFails = 0, lockUntil = 0, hiddenAt = 0;
  function bioPlugin() { return isNative() && window.Capacitor.Plugins && window.Capacitor.Plugins.NativeBiometric; }
  function showLock() {
    if (!lockEnabled()) return;
    $('lock-screen').hidden = false;
    document.body.classList.add('locked');
    $('lock-pin').value = '';
    setText('lock-msg', '');
    $('lock-reset').hidden = true;
    var B = bioPlugin();
    $('lock-bio').hidden = !(B && state.lock.bio);
    if (B && state.lock.bio) tryBio();
  }
  function hideLock() {
    $('lock-screen').hidden = true;
    document.body.classList.remove('locked');
    document.body.classList.remove('lock-sos');
    lockFails = 0;
  }
  function isLocked() { return !$('lock-screen').hidden; }
  function tryUnlock() {
    var pin = ($('lock-pin').value || '').trim();
    if (Date.now() < lockUntil) { setText('lock-msg', 'Take a breath. You can try again in a few seconds.'); return false; }
    if (pinHash(pin, state.lock.salt) === state.lock.hash) { hideLock(); haptic('success'); return true; }
    lockFails++;
    $('lock-pin').value = '';
    if (lockFails >= 5) { lockUntil = Date.now() + 30000; lockFails = 0; setText('lock-msg', 'Too many tries. Pause for 30 seconds, then try again.'); }
    else setText('lock-msg', 'That PIN did not match. Try again.');
    return false;
  }
  function tryBio() {
    var B = bioPlugin();
    if (!B) return;
    B.verifyIdentity({ reason: 'Unlock LoosenUp', title: 'Unlock LoosenUp', subtitle: 'Your notes stay private' })
      .then(function () { hideLock(); haptic('success'); }, function () { setText('lock-msg', 'Use your PIN instead.'); });
  }
  function renderLockCard() {
    var on = lockEnabled();
    setText('lock-status', on ? 'App lock is on. LoosenUp asks for your PIN when it opens.' : 'Keep your notes private with a PIN.');
    setText('lock-toggle', on ? 'Turn off app lock' : 'Set a PIN');
    $('lock-setup').hidden = true;
    $('lock-off-form').hidden = true;
    var B = bioPlugin();
    $('bio-toggle').hidden = !(on && B);
    setText('bio-toggle', 'Use Face ID or fingerprint: ' + (state.lock.bio ? 'on' : 'off'));
    $('bio-toggle').setAttribute('aria-pressed', String(!!state.lock.bio));
  }
  function savePin() {
    var a1 = ($('pin-new').value || '').trim(), a2 = ($('pin-confirm').value || '').trim();
    if (!/^\d{4,6}$/.test(a1)) { toast('Use 4 to 6 digits.'); return false; }
    if (a1 !== a2) { toast('The two PINs did not match.'); return false; }
    var salt = randomSalt();
    state.lock = { enabled: true, salt: salt, hash: pinHash(a1, salt), bio: false };
    save();
    $('pin-new').value = ''; $('pin-confirm').value = '';
    renderLockCard();
    toast('App lock is on.');
    return true;
  }
  function turnOffLock() {
    var pin = ($('pin-current').value || '').trim();
    if (pinHash(pin, state.lock.salt) !== state.lock.hash) { toast('That PIN did not match.'); return false; }
    state.lock = { enabled: false, salt: '', hash: '', bio: false };
    save();
    $('pin-current').value = '';
    renderLockCard();
    toast('App lock is off.');
    return true;
  }


  /* ---------- Language: English and Hindi ---------- */
  // English is written in the page and the code. In Hindi, every rendered English text node
  // and label is swapped for its Hindi version (www/i18n.js). The English original is kept
  // so switching back restores it exactly. Names and anything the user types are left alone.
  var TR_ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  var trText = typeof WeakMap === 'function' ? new WeakMap() : null;
  var trAttr = typeof WeakMap === 'function' ? new WeakMap() : null;
  function isHindi() { return state.lang === 'hi' && !!window.LoosenUpI18n && !!trText; }
  function tr(s) { return isHindi() ? window.LoosenUpI18n.tr(s) : s; }
  function locale() { return state.lang === 'hi' ? 'hi-IN' : 'en-GB'; }
  function skipNode(el) { return !el || !!el.closest('script, style, textarea, [data-no-tr]'); }
  function trTextNode(n, hindi) {
    var rec = trText.get(n);
    if (hindi) {
      if (rec && n.data === rec.hi) return;
      if (!/[A-Za-z]/.test(n.data) || skipNode(n.parentElement)) return;
      var hi = window.LoosenUpI18n.tr(n.data);
      if (hi !== n.data) { trText.set(n, { en: n.data, hi: hi }); n.data = hi; }
    } else if (rec && n.data === rec.hi) n.data = rec.en;
  }
  function trElAttrs(el, hindi) {
    if (!el || el.closest('[data-no-tr]')) return;
    var recs = trAttr.get(el) || {};
    for (var i = 0; i < TR_ATTRS.length; i++) {
      var a = TR_ATTRS[i], v = el.getAttribute(a);
      if (v == null) continue;
      var rec = recs[a];
      if (hindi) {
        if (rec && v === rec.hi) continue;
        var hi = window.LoosenUpI18n.tr(v);
        if (hi !== v) { recs[a] = { en: v, hi: hi }; el.setAttribute(a, hi); }
      } else if (rec && v === rec.hi) el.setAttribute(a, rec.en);
    }
    trAttr.set(el, recs);
  }
  function translateDom(root, toEnglish) {
    if (!trText || !window.LoosenUpI18n) return;
    root = root || document.body;
    var hindi = !toEnglish && state.lang === 'hi';
    if (root.nodeType === 3) { trTextNode(root, hindi); return; }
    var w = document.createTreeWalker(root, 4, null, false), n;
    var texts = [];
    while ((n = w.nextNode())) texts.push(n);
    texts.forEach(function (t) { trTextNode(t, hindi); });
    if (root.nodeType === 1) {
      trElAttrs(root, hindi);
      var els = root.querySelectorAll('[' + TR_ATTRS.join('], [') + ']');
      for (var i = 0; i < els.length; i++) trElAttrs(els[i], hindi);
    }
  }
  var trObserver = null;
  function watchDom() {
    if (trObserver || typeof MutationObserver !== 'function') return;
    trObserver = new MutationObserver(function (list) {
      if (!isHindi()) return;
      list.forEach(function (m) {
        if (m.type === 'characterData') trTextNode(m.target, true);
        else if (m.type === 'attributes') trElAttrs(m.target, true);
        else for (var i = 0; i < m.addedNodes.length; i++) translateDom(m.addedNodes[i]);
      });
    });
    trObserver.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: TR_ATTRS });
  }
  function applyLang() {
    var hindi = isHindi();
    document.documentElement.setAttribute('lang', hindi ? 'hi' : 'en');
    var btns = document.querySelectorAll('[data-lang-choice]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(btns[i].getAttribute('data-lang-choice') === (state.lang || 'en')));
    if (hindi) { watchDom(); translateDom(document.body); }
    else translateDom(document.body, true);
  }
  function setLang(l) {
    state.lang = l === 'hi' ? 'hi' : 'en';
    save();
    applyLang();
    if (current) go(current);
    if (state.goldenHour) scheduleGoldenHour();
    toast(state.lang === 'hi' ? 'अब LoosenUp हिन्दी में है।' : 'LoosenUp is now in English.');
  }

  /* ---------- Learn: one-minute lessons ---------- */
  var LESSONS = [
    { id: 'breath', title: 'Why a long breath out helps', min: 1,
      body: ['When your breath out is slower than your breath in, your body gets a quiet signal that it is safe to slow down.',
        'Many people notice their heartbeat ease a little and their shoulders drop after a few long breaths out. That is why Sigh of relief and Cool down stretch the out-breath.',
        'You can use this anywhere: in a meeting, in traffic, before a hard talk. Nobody needs to know.'],
      takeaway: 'Make the out-breath longer than the in-breath.', tryLabel: 'Try Sigh of relief', tryTech: 'sigh' },
    { id: 'thoughts', title: 'Thoughts are guesses, not facts', min: 1,
      body: ['A thought like "I always mess things up" can feel completely true in the moment. It is really a guess your mind makes, often on a tired or heavy day.',
        'Thoughts, feelings and actions move together. When you look at a thought from a little distance, the feeling often softens too.',
        'Ask: what would I tell a dear friend who had this thought? Then try saying it to yourself.'],
      takeaway: 'Notice the thought, then look for a kinder, truer version.', tryLabel: 'Reframe a thought', tryTool: 'reframe' },
    { id: 'steps', title: 'On heavy days, action comes first', min: 1,
      body: ['When energy is low, it is natural to wait until you feel like doing something. Often the feeling follows the action instead.',
        'Tiny actions count: a glass of water, two minutes of daylight, a hello to someone you trust. Each one is a small vote for yourself.',
        'Pick something so small it feels almost too easy. Then notice how you feel afterwards.'],
      takeaway: 'Start tiny. The lift often comes after the step.', tryLabel: 'Take a Small step', tryTool: 'today' },
    { id: 'sleep', title: 'A gentle runway to sleep', min: 1,
      body: ['Sleep comes more easily when the hour before bed slows down. Dim the lights, put the phone face down, and keep the room cool and quiet.',
        'Waking at about the same time each day, even on weekends, helps your body know when to feel sleepy.',
        'If your mind races in bed, write the thoughts down or play a soft sound, then return to slow breathing.'],
      takeaway: 'Same wake time, a softer last hour, and a calm sound if you need it.', tryLabel: 'Play a calm sound', tryTool: 'sounds' },
    { id: 'kindness', title: 'Talk to yourself like a friend', min: 1,
      body: ['Many of us speak to ourselves more harshly than we would ever speak to anyone we love.',
        'Self-kindness is not letting yourself off the hook. It is the steady voice that helps you try again.',
        'Try a hand on your heart and the words: this is a hard moment, I am not alone, may I be kind to myself.'],
      takeaway: 'Use the voice you would use for a dear friend.', tryLabel: 'Try Kind words', tryTech: 'kind' },
    { id: 'work', title: 'Boundaries that protect your energy at work', min: 1,
      body: ['Energy at work comes back in small pieces: a two-minute pause between meetings, one task at a time, a real lunch away from the screen.',
        'Saying "I can do this by Friday" is clearer and kinder than saying yes to everything today.',
        'End the day with a small ritual, like closing the laptop and three slow breaths, so your mind knows work is done.'],
      takeaway: 'Small pauses and clear limits keep you steady through the week.', tryLabel: 'Open the Work space', trySpace: 'work' },
    { id: 'repair', title: 'Repair after a disagreement', min: 1,
      body: ['Disagreements happen in every close relationship. What matters most is the repair afterwards.',
        'Wait until both of you feel calmer. Start with "I felt" rather than "You always". Listen to understand, not to reply.',
        'Owning your part, even a small part, often opens the door for the other person to do the same.'],
      takeaway: 'Calm down first, speak from "I", and repair early.', tryLabel: 'Try Pause before replying', tryTech: 'pause' },
    { id: 'friend', title: 'Supporting a friend who is struggling', min: 1,
      body: ['Listening without fixing is one of the kindest things you can offer. Try: "That sounds really hard. I am here."',
        'If you are worried about them, ask directly: "Are you thinking about ending your life?" Asking does not put the idea in their head, and it can be a huge relief.',
        'If they say yes, stay with them and call Tele-MANAS on 14416 together, or 112 in an emergency.'],
      takeaway: 'Listen, ask directly, and connect them to support.', tryLabel: 'See helplines and support', tryTool: 'support' },
    { id: 'help', title: 'When to talk to a professional', min: 1,
      body: ['Everyone has heavy days. It is a good time to talk to a professional if low moods last more than two weeks, if sleep, eating or work are clearly affected, or if you have thoughts of hurting yourself.',
        'A psychiatrist is a doctor who can assess and prescribe. A psychologist or counsellor offers talk therapy. Tele-MANAS (14416) can help you decide, for free.',
        'Reaching out early is a strength. Many people feel lighter after just the first conversation.'],
      takeaway: 'Two weeks of heavy days is a good reason to reach out.', tryLabel: 'Find support', tryTool: 'support' }
  ];
  var currentLesson = null;
  function renderLearn() {
    var ul = $('lesson-list');
    ul.textContent = '';
    LESSONS.forEach(function (l) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lesson-item';
      b.setAttribute('data-lesson', l.id);
      var t = document.createElement('strong'); t.textContent = l.title;
      var m = document.createElement('span');
      m.textContent = state.lessonsDone.indexOf(l.id) !== -1 ? 'Read' : l.min + ' min';
      if (state.lessonsDone.indexOf(l.id) !== -1) b.classList.add('done');
      b.appendChild(t); b.appendChild(m); li.appendChild(b); ul.appendChild(li);
    });
  }
  function openLesson(id) {
    var l = LESSONS.filter(function (x) { return x.id === id; })[0];
    if (!l) return;
    currentLesson = l;
    go('lesson');
    setText('lesson-meta', 'Lesson ' + (LESSONS.indexOf(l) + 1) + ' of ' + LESSONS.length);
    setText('lesson-title', l.title);
    var body = $('lesson-body');
    body.textContent = '';
    l.body.forEach(function (para) { var p0 = document.createElement('p'); p0.textContent = para; body.appendChild(p0); });
    setText('lesson-takeaway', l.takeaway);
    setText('lesson-try', l.tryLabel);
    if (state.lessonsDone.indexOf(l.id) === -1) { state.lessonsDone.push(l.id); state.xp += 2; save(); }
    translateDom(document.getElementById('screen-lesson'));
  }
  function tryLesson() {
    var l = currentLesson;
    if (!l) return;
    if (l.tryTech) {
      startCheckin('guided');
      flow.technique = l.tryTech; flow.picked = true; flow.fromLesson = true; flow.reason = 'From your lesson: ' + l.title + '.';
    } else if (l.trySpace) startCheckin('guided', l.trySpace);
    else go(l.tryTool);
  }

  /* ---------- Theme ---------- */
  function resolvedTheme() {
    var t = state.theme || 'auto';
    return t === 'dark' || (t === 'auto' && mm('(prefers-color-scheme: dark)')) ? 'dark' : 'light';
  }
  function applyTheme() {
    var r = resolvedTheme();
    document.documentElement.setAttribute('data-theme', r);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', r === 'dark' ? '#0E1626' : '#EDF7FF');
    try { window.localStorage.setItem('loosenup.theme', state.theme || 'auto'); } catch (e) { /* private mode */ }
    var btns = document.querySelectorAll('[data-theme-choice]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(btns[i].getAttribute('data-theme-choice') === (state.theme || 'auto')));
  }
  function setTheme(t) { state.theme = t; save(); applyTheme(); }

  /* ---------- Live updates (iPhone and Android apps) ---------- */
  // The native apps check our own domain for a newer web bundle, download it in the
  // background (checksum verified) and switch to it the next time LoosenUp opens.
  // Nothing is sent to third parties. If an update fails to start, the plugin rolls back.
  var UPDATE_MANIFEST = 'https://loosenup-ios.anchit-tandon.com/updates/latest.json';
  function newerVersion(a, b) {
    var x = String(a).split('.').map(Number), y = String(b).split('.').map(Number);
    for (var i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); }
    return false;
  }
  function liveUpdate() {
    var U = isNative() && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorUpdater;
    if (!U) return Promise.resolve('web');
    try { U.notifyAppReady(); } catch (e) { /* older bundle */ }
    return fetch(UPDATE_MANIFEST + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) {
        if (!m || !m.version || !m.url || !newerVersion(m.version, VERSION)) return 'current';
        return U.download({ url: m.url, version: m.version, checksum: m.checksum }).then(function (bundle) {
          return U.next({ id: bundle.id }).then(function () {
            toast('A fresh LoosenUp update is ready. It opens next time you launch the app.');
            return 'queued';
          });
        });
      })
      .catch(function () { return 'offline'; });
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
    var gameId = el.getAttribute('data-game');
    var card = el.getAttribute('data-card');
    var guide = el.getAttribute('data-guide');
    if (guide) { if (guide === 'voice') state.voice = !state.voice; else state.chime = !state.chime; save(); renderGuide(); renderVoiceButtons(); if (guide === 'chime' && state.chime) chime(); haptic('light'); return; }
    var bed = el.getAttribute('data-bed');
    if (bed) { state.bed = bed; save(); renderGuide(); haptic('light'); return; }
    var lessonId = el.getAttribute('data-lesson');
    if (lessonId) { openLesson(lessonId); return; }
    var themeChoice = el.getAttribute('data-theme-choice');
    if (themeChoice) { setTheme(themeChoice); haptic('light'); return; }
    var pf = el.getAttribute('data-pfilter');
    if (pf) { partnerFilter = pf; renderPartners(); return; }
    var prog = el.getAttribute('data-program');
    if (prog) { openProgram(prog); return; }
    var seg = el.getAttribute('data-seg');
    if (seg) { setSeg(seg); haptic('light'); return; }
    var practice = el.getAttribute('data-practice');
    if (practice) { startPractice(practice); haptic('light'); return; }
    var langChoice = el.getAttribute('data-lang-choice');
    if (langChoice) { setLang(langChoice); haptic('light'); return; }
    var tool = el.getAttribute('data-tool');
    if (tool) { closeSheets(true); go(tool); return; }
    if (el.hasAttribute('data-back')) { go(lastTab || 'today'); return; }
    var wb = el.getAttribute('data-wb');
    if (wb) { var parts = wb.split(':'); answerWb(+parts[0], +parts[1]); haptic('light'); return; }
    var snd = el.getAttribute('data-sound');
    if (snd) { if (audio && audio.kind === snd) stopSound(false); else playSound(snd); haptic('light'); return; }
    var tmr = el.getAttribute('data-timer');
    if (tmr !== null) { setSleepTimer(+tmr); return; }
    var spaceTab = el.getAttribute('data-space-tab');
    var unpick = el.getAttribute('data-unpick');
    if (spaceTab) {
      flow.spaceTab = spaceTab;
      var groups = document.querySelectorAll('[data-group]');
      for (var gi = 0; gi < groups.length; gi++) groups[gi].hidden = groups[gi].getAttribute('data-group') !== spaceTab;
      var ts = document.querySelectorAll('[data-space-tab]');
      for (var ti = 0; ti < ts.length; ti++) ts[ti].setAttribute('aria-selected', String(ts[ti] === el));
      haptic('light');
      return;
    }
    if (unpick) { toggleContext(unpick); return; }
    var spaceId = el.getAttribute('data-space');
    var moodV = el.getAttribute('data-mood');
    if (spaceId) { haptic('medium'); startCheckin('guided', spaceId); return; }
    if (moodV) { haptic('light'); setMood(+moodV); return; }
    if (id === 'sos-alert') { sendSos(e); return; }
    if (gameId) { openGame(gameId); return; }
    if (card !== null) { flipCard(+card); return; }
    if (ctx) {
      toggleContext(ctx);
      return;
    }
    if (pick) {
      if (!isUnlocked(pick)) return;
      flow.technique = pick;
      flow.picked = true;
      var rf = recommendFor(flow.contexts);
      flow.reason = pick === rf.id ? rf.reason : 'Your choice. Enjoy it.';
      renderPick();
      return;
    }
    if (tab) { go(tab); return; }
    if (sku) { openCheckout(sku); return; }
    switch (id) {
      case 'gift-go': startCheckin('guided'); break;
      case 'checkin-next':
        flow.before = clampScore($('calm-before').value);
        if (!flow.context) { flow.context = 'Just a quick lift'; flow.contexts = [flow.context]; }
        if (flow.mode === 'quick') beginBreak('quick');
        else { flow.picked = !!(flow.fromLesson || flow.chosen); go('pick'); }
        break;
      case 'checkin-back': go(flow.program ? 'program' : flow.chosen ? 'play' : state.onboarded ? 'today' : 'gift'); break;
      case 'program-start': startProgramDay(); break;
      case 'inperson-locate': locateInPerson(); break;
      case 'org-join-btn': joinOrg($('org-code').value); break;
      case 'org-share': toggleOrgShare(); break;
      case 'org-leave': leaveOrg(); break;
      case 'pick-begin': beginBreak(flow.technique); break;
      case 'pick-quick': beginBreak('quick'); break;
      case 'session-finish': endSession(false); break;
      case 'session-pause': togglePause(); break;
      case 'session-voice': case 'voice-toggle': toggleVoice(); break;
      case 'step-next': if (run && TECH[run.id].steps && run.step < TECH[run.id].steps.length - 1) { run.stepLeft = Math.floor(TECH[run.id].seconds / TECH[run.id].steps.length); showStep(run.step + 1); } break;
      case 'after-next': finishAfter(); break;
      case 'result-done': go('today'); break;
      case 'game-back': go('play'); break;
      case 'game-again': if (game) openGame(game.id); break;
      case 'start-break': startCheckin('guided'); break;
      case 'quick-breeze': startCheckin('quick'); break;
      case 'open-shop': openShop(); break;
      case 'shop-close': case 'checkout-cancel': case 'support-close': case 'reset-cancel': closeSheets(); document.body.classList.remove('lock-sos'); break;
      case 'checkout-confirm': demoPurchase(pendingSku); break;
      case 'open-support': case 'sos-btn': case 'support-card-sos': openSupport(); break;
      case 'open-trusted': openSupport(true); break;
      case 'trusted-edit': renderSos(true); break;
      case 'trusted-save': saveTrusted(); break;
      case 'sos-location': state.sosLocation = !state.sosLocation; save(); renderSos(false); break;
      case 'sos-breathe':
        closeSheets(true);
        flow = { mode: 'quick', before: 5, context: 'Just a quick lift', technique: 'quick', space: null };
        beginBreak('quick');
        break;
      case 'safety-yes': openSupport(); break;
      case 'safety-no':
        closeSheets();
        setText('mood-done', MOOD_NOTES[1]);
        toast('Thank you. We are glad you are here.');
        break;
      case 'step-done': doStep(); break;
      case 'support-card-step': if ($('steps-card').scrollIntoView) $('steps-card').scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
      case 'step-another': stepOffset++; renderSteps(); break;
      case 'jar-add': openJar(); break;
      case 'care-save': saveCare(); break;
      case 'lesson-back': go('learn'); break;
      case 'lesson-try': tryLesson(); break;
      case 'lock-unlock': tryUnlock(); break;
      case 'lock-bio': tryBio(); break;
      case 'lock-sos': document.body.classList.add('lock-sos'); openSupport(); break;
      case 'lock-forgot': $('lock-reset').hidden = false; break;
      case 'lock-erase':
        try { window.localStorage.removeItem(KEY); } catch (err) { /* nothing stored */ }
        state = freshState(); hideLock(); go('welcome'); toast('A fresh start. You can restore a backup from Me.');
        break;
      case 'lock-toggle':
        if (lockEnabled()) { $('lock-off-form').hidden = false; $('lock-setup').hidden = true; }
        else { $('lock-setup').hidden = false; $('lock-off-form').hidden = true; }
        break;
      case 'pin-save': savePin(); break;
      case 'pin-off': turnOffLock(); break;
      case 'bio-toggle':
        var BP = bioPlugin();
        if (!BP) break;
        BP.isAvailable().then(function (r) {
          if (!r || !r.isAvailable) { toast('Face ID or fingerprint is not set up on this phone.'); return; }
          state.lock.bio = !state.lock.bio; save(); renderLockCard();
        }, function () { toast('Face ID or fingerprint is not available.'); });
        break;
      case 'care-edit': renderCare(true); break;
      case 'copy-script': copyScript(); break;
      case 'sp-save': saveSafety(); break;
      case 'rf-next': rfNext(); break;
      case 'rf-keep': keepKinder(); break;
      case 'sound-stop': stopSound(false); break;
      case 'wb-submit': submitWb(); break;
      case 'backup-export': exportBackup(); break;
      case 'good-save': saveGood(); break;
      case 'good-close': $('good-text').value = ''; closeSheets(); break;
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
    }
    save();
    var slots = document.querySelectorAll('.name-slot');
    for (var i = 0; i < slots.length; i++) slots[i].textContent = state.name;
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
    $('good-text').addEventListener('input', onGoodInput);
    var rfs = document.querySelectorAll('.rf');
    for (var ri = 0; ri < rfs.length; ri++) rfs[ri].addEventListener('input', onRfInput);
    ['rf-before', 'rf-after'].forEach(function (id) { $(id).addEventListener('input', function () { setText(id + '-out', $(id).value); }); });
    $('sound-volume').addEventListener('input', function () { if (audio) audio.out.gain.setTargetAtTime(soundVolume(), audio.ctx.currentTime, 0.3); });
    $('backup-import').addEventListener('change', onImport);
    $('scrim').addEventListener('click', function () { closeSheets(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('scrim').hidden) closeSheets(); });
    addPetals($('orb-petals'), 0, 0, 1);
    addPetals($('rs-petals'), 180, 132, 0.9, 'rp');
    bindSlider('calm-before');
    bindSlider('calm-after');
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; if (current === 'me') renderInstall(); });
    window.addEventListener('appinstalled', function () { installEvt = null; toast('LoosenUp is on your home screen.'); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && current === 'today') renderGoldenBanner(); });
    applyTheme();
    applyLang();
    bindCalmGestures();
    $('inperson-city').addEventListener('change', function () { inPerson.here = null; setText('inperson-status', ''); setCity(this.value); });
    $('lock-pin').addEventListener('keydown', function (e) { if (e.key === 'Enter') tryUnlock(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) hiddenAt = Date.now();
      else if (lockEnabled() && hiddenAt && Date.now() - hiddenAt > 60000) showLock();
    });
    if (lockEnabled()) showLock();
    try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if ((state.theme || 'auto') === 'auto') applyTheme(); }); } catch (e) { /* older browsers */ }
    renderIosTip();
    go(state.onboarded ? 'today' : 'welcome');
    registerSW();
    if (state.goldenHour) scheduleGoldenHour();
    liveUpdate();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) liveUpdate(); });
    sendPulse();
    loadVoiceClips();
  }

  /* ---------- Public API (used by the app shell and the test suite) ---------- */

  window.LoosenUp = {
    version: VERSION,
    state: function () { return JSON.parse(JSON.stringify(state)); },
    setState: function (patch) { for (var k in patch) state[k] = patch[k]; save(); if (current && RENDER[current]) RENDER[current](); renderSeedPill(); },
    setNow: function (d) { nowOverride = d ? new Date(d) : null; },
    setRng: function (fn) { rng = fn || Math.random; },
    currentScreen: function () { return current; },
    go: go,
    recommend: recommend,
    recommendFor: recommendFor,
    newerVersion: newerVersion,
    restoreBackup: restoreBackup,
    setTheme: setTheme,
    chimesPlayed: function () { return chimesPlayed; },
    lessons: LESSONS,
    openLesson: openLesson,
    isLocked: isLocked,
    showLock: showLock,
    setLang: setLang,
    setSeg: setSeg,
    joinOrg: joinOrg,
    loadVoiceClips: loadVoiceClips,
    clipFor: clipFor,
    useLocation: useLocation,
    setCity: setCity,
    sendPulse: sendPulse,
    weekPulse: weekPulse,
    programs: PROGRAMS,
    programStatus: programStatus,
    openProgram: openProgram,
    startProgramDay: startProgramDay,
    calmSeg: function () { return calmSeg; },
    startPractice: startPractice,
    tr: tr,
    translateDom: translateDom,
    sha256: sha256,
    resolvedTheme: resolvedTheme,
    wellbeingNote: wellbeingNote,
    checkDue: checkDue,
    playSound: playSound,
    liveUpdate: liveUpdate,
    updateManifest: UPDATE_MANIFEST,
    isUnlocked: isUnlocked,
    completeSession: completeSession,
    beginBreak: beginBreak,
    openShop: function (note) { openShop(note); },
    demoPurchase: demoPurchase,
    isCrisis: isCrisis,
    sosHref: sosHref,
    spaces: SPACES,
    dayKey: dayKey,
    weekKey: weekKey,
    prefersReducedMotion: prefersReducedMotion,
    shareSunbeam: shareSunbeam,
    openGame: openGame,
    game: function () { return game; },
    flipCard: flipCard,
    spawnBeam: spawnBeam,
    finishCurrentGame: finishCurrentGame,
    voiceLines: function () {
      var out = [INTRO.breath, INTRO.steps, INTRO.journal, OUTRO, 'Voice guide on.', 'Breathe in', 'Breathe out'];
      Object.keys(TECH).forEach(function (k) {
        var t = TECH[k];
        out.push(t.desc);
        (t.pattern || []).forEach(function (p) { out.push(p[0]); });
        (t.steps || []).forEach(function (st) { out.push(st); });
      });
      return out.filter(function (x, i) { return out.indexOf(x) === i; });
    },
    techniques: TECH
  };

  // The script is deferred, so the DOM is ready; fall back to DOMContentLoaded if it is not.
  if (document.getElementById('tabbar')) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
