/* LoosenUp - 2-minute guided calm breaks. Data stays on this device (localStorage). */
(function () {
  'use strict';

  var VERSION = '1.5.0';
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
      id: 'release', name: 'Soft release', seconds: 120, unlockAt: 3, color: '#C9A7F2', kind: 'steps',
      desc: 'Tense each area for a breath, then let it go soft, from shoulders to toes.',
      steps: ['Lift your shoulders up to your ears. Hold. Let them drop.', 'Make two fists. Squeeze. Open your hands wide and soft.',
        'Scrunch your face. Then let your jaw hang loose.', 'Press your feet into the floor. Then let them rest.', 'Take one long breath and feel your whole body settle.']
    },
    letitout: {
      id: 'letitout', name: 'Let it out', seconds: 120, unlockAt: 5, color: '#FFC857', kind: 'journal',
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

  var MOODS = [null, 'Very heavy', 'Heavy', 'Okay', 'Light', 'Bright'];
  var MOOD_NOTES = [null,
    'Thank you for being honest. Kind words or a Small step are here for you, and so is SOS.',
    'Heavy days happen. Kind words or a Small step can help a little.',
    'Okay is okay. A Small step could add a little lift.',
    'Light today. A calm break can keep the good going.',
    'Bright today. Lovely! Maybe share a Sunbeam and pass it on.'];
  var STEPS = ['Step outside or by a window for two minutes of daylight.', 'Drink a full glass of water, slowly.',
    'Stretch your arms up high, then let them float down.', 'Send a short hello to someone you trust.',
    'Tidy one small thing near you.', 'Play one song you love and let yourself enjoy it.',
    'Wash your face or hands with cool water.', 'Eat something nourishing, even something small.',
    'Open a window and take three easy breaths.', 'Walk to the end of the street and back.',
    'Write one kind line to tomorrow you.', 'Water a plant, or look at something green for a minute.',
    'Change into something comfortable.', 'Give yourself a small smile in the mirror.'];
  var LIFT_XP_PER_DAY = 3;

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
    sharer: ['Sunbeam sharer', 'Shared LoosenUp'],
    golden: ['Golden hour', 'Set a daily time'],
    playful: ['Playful', 'Played a calm game']
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
      nudges: { day: null, count: 0, shown: [] }, goldenHour: null, voice: false, badges: [], purchases: [],
      games: { day: null, count: 0 }, gameBest: { pairs: null, catch: 0, bloom: 0 },
      moods: [], smallSteps: [], goodThings: [], trusted: null, sosLocation: false, jarXp: { day: null, count: 0 }
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
    var ctxList = (input.contexts && input.contexts.length ? input.contexts : [input.context || 'Just a quick lift']).slice(0, 8);
    state.sessions.push({ ts: d.getTime(), day: dk, technique: input.technique, context: ctxList[0], contexts: ctxList,
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
  var TABS = ['today', 'play', 'garden', 'week', 'me'];
  var flow = { mode: 'guided', before: 5, context: null, technique: null };

  function go(name) {
    if (name !== 'game') stopGame();
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
  function openSupport(editing) {
    renderSos(editing);
    openSheet('support-sheet');
    if (editing && $('trusted-name').focus) $('trusted-name').focus();
  }

  /* ---------- Check-in and pick ---------- */

  var CALM_WORDS = ['', 'A bit tangled', 'A bit tangled', 'A little tense', 'Somewhere in the middle', 'Somewhere in the middle',
    'Fairly settled', 'Fairly calm', 'Calm', 'Very calm', 'Wonderfully calm'];
  function bindSlider(id) {
    var el = $(id);
    var sun = $(id + '-sun');
    var upd = function () {
      setText(id + '-out', el.value);
      setText(id + '-word', CALM_WORDS[+el.value] || '');
      // The petal sun opens wider as calm rises.
      if (sun) sun.style.transform = 'scale(' + (0.62 + 0.04 * +el.value).toFixed(2) + ') rotate(' + (+el.value * 9) + 'deg)';
    };
    el.addEventListener('input', upd);
    el.addEventListener('change', upd);
    upd();
    return upd;
  }

  function renderContextChips() {
    var box = $('context-chips');
    box.textContent = '';
    var only = flow.space && !flow.showAll ? [flow.space] : SPACE_ORDER;
    only.forEach(function (k) {
      var group = document.createElement('div');
      group.className = 'context-group';
      if (only.length > 1) { var h = document.createElement('h3'); h.textContent = SPACES[k].name; group.appendChild(h); }
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
    $('context-all').hidden = !(flow.space && !flow.showAll);
    setText('context-count', (flow.contexts || []).length > 1 ? flow.contexts.length + ' picked' : '');
    setText('checkin-step', 'Step 1 of 3' + (flow.space ? ' \u00b7 ' + SPACES[flow.space].name : ''));
  }

  function startCheckin(mode, space) {
    flow = { mode: mode, before: 5, context: null, contexts: [], technique: mode === 'quick' ? 'quick' : null, space: space || null, showAll: false };
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
    $('orb-petals').style.transitionDuration = '0s';
    $('orb-petals').style.transform = 'scale(0.55)';
    setText('session-kicker', t.free ? 'Always free' : 'Guided break');
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
    speak(t.steps[i]);
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
    var r = completeSession({ technique: flow.technique || 'quick', context: flow.context || 'Just a quick lift', contexts: flow.contexts, before: before, after: after });
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
  function miniFlower(parent, x, y, r, color) {
    for (var k = 0; k < 5; k++) {
      var a = k * 72 * Math.PI / 180;
      svg('circle', { cx: (x + Math.cos(a) * r * 0.8).toFixed(1), cy: (y + Math.sin(a) * r * 0.8).toFixed(1), r: (r * 0.62).toFixed(1), fill: color }, parent);
    }
    svg('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: (r * 0.45).toFixed(1), fill: '#FFC857' }, parent);
  }
  function renderSky() {
    var d = now();
    var b = bucketOf(d.getTime());
    var card = $('today-sky');
    card.setAttribute('data-time', b);
    // The sun travels an arc from 6:00 to 20:00.
    var hrs = d.getHours() + d.getMinutes() / 60;
    var t = Math.max(0, Math.min(1, (hrs - 6) / 14));
    card.style.setProperty('--sx', (16 + t * 68).toFixed(1) + '%');
    card.style.setProperty('--sy', (62 - Math.sin(t * Math.PI) * 44).toFixed(1) + '%');
    setText('today-date', d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }));
    setText('today-sky-streak', state.sessions.length
      ? plural(state.streak.count, 'Sunny day', 'Sunny days') + ' · ' + plural(state.sessions.length, 'flower', 'flowers')
      : 'Your first flower is one break away');
    var fl = $('today-flowers');
    while (fl.firstChild) fl.removeChild(fl.firstChild);
    state.sessions.slice(-16).forEach(function (s, i) {
      var r = seeded(i + 7);
      miniFlower(fl, 14 + r() * 332, 54 + r() * 20, 4.2, (TECH[s.technique] || TECH.breeze).color);
    });
  }

  function renderToday() {
    renderSky();
    setText('today-title', greeting());
    setText('today-streak', state.streak.count ? plural(state.streak.count, 'Sunny day', 'Sunny days') : 'Starts today');
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
    if (!found) { state.moods.push({ day: dk, mood: n }); state.xp += 2; }
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
    setText('steps-note', today ? plural(today, 'small step', 'small steps') + ' today. Each one plants a sprout.' : 'Tiny actions count. Each one plants a sprout in your garden.');
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
    toast(xp ? 'Lovely. A sprout joins your garden. +3 XP' : 'Lovely. A sprout joins your garden.');
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
    toast(xp ? 'Saved in your jar. +2 XP' : 'Saved in your jar.');
  }

  /* ---------- SOS ---------- */

  function sosHref(loc) {
    var t = state.trusted;
    if (!t) return '#';
    var body = 'Hi ' + t.name + ', it is ' + (state.name && state.name !== 'friend' ? state.name : 'me') +
      '. I am having a really hard time and could really use you right now. Can you call me or come be with me?';
    if (loc) body += ' I am here: https://maps.google.com/?q=' + loc.lat.toFixed(5) + ',' + loc.lon.toFixed(5);
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
    state.smallSteps.slice(-60).forEach(function (st, j) {
      var rr = seeded(j + 101);
      var sx0 = 14 + rr() * 332, sy0 = 238 + rr() * 16;
      var sp = svg('g', { 'class': 'sprout' }, g);
      svg('path', { d: 'M' + sx0.toFixed(1) + ' ' + sy0.toFixed(1) + ' v -10', stroke: '#2E7D5B', 'stroke-width': 2, 'stroke-linecap': 'round' }, sp);
      svg('ellipse', { cx: (sx0 - 4).toFixed(1), cy: (sy0 - 11).toFixed(1), rx: 4.5, ry: 2.4, fill: '#7AC498', transform: 'rotate(-25 ' + (sx0 - 4).toFixed(1) + ' ' + (sy0 - 11).toFixed(1) + ')' }, sp);
      svg('ellipse', { cx: (sx0 + 4).toFixed(1), cy: (sy0 - 12).toFixed(1), rx: 4.5, ry: 2.4, fill: '#4FA67C', transform: 'rotate(25 ' + (sx0 + 4).toFixed(1) + ' ' + (sy0 - 12).toFixed(1) + ')' }, sp);
    });
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
    setText('me-trusted', state.trusted ? 'Trusted person: ' + state.trusted.name + ' (' + state.trusted.phone + '). SOS can message them in one tap.'
      : 'Add a trusted person so SOS can message them in one tap.');
    setText('open-trusted', state.trusted ? 'Change my trusted person' : 'Set up my trusted person');
  }

  var RENDER = { today: renderToday, play: renderPlay, garden: renderGarden, week: renderWeek, me: renderMe, pick: renderPick, checkin: renderContextChips };

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
    var text = 'Two calm minutes that brighten my day. Grow a garden with me on LoosenUp. Android: ' + ANDROID_URL + '  iPhone: ' + IOS_URL;
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

  /* ---------- Play: calm mini-games (every round ends kindly, never cost Seeds) ---------- */

  var GAMES = {
    pairs: { name: 'Petal Pairs', help: 'Turn two cards at a time. Matching flowers stay open. Take all the time you like.' },
    catch: { name: 'Sunbeam Catch', help: 'Tap the sunbeams and petals as they drift by. Every catch fills your jar.' },
    bloom: { name: 'Breath Bloom', help: 'Press and hold while the ring grows to breathe in. Let go as it shrinks to breathe out. Six breaths, six flowers.' }
  };
  var FLOWERS = [['Sunflower', '#FFC857'], ['Peach rose', '#FFB088'], ['Fern bell', '#4FA67C'], ['Sky poppy', '#8CC8F0'], ['Lilac', '#C9A7F2'], ['Blush daisy', '#F28FA0']];
  var game = null;

  function renderPlay() {
    var dk = dayKey(now());
    var played = state.games.day === dk ? state.games.count : 0;
    setText('play-note', played >= DAILY_GAME_REWARDS
      ? 'You have gathered today\'s game XP. Play on just for the joy of it.'
      : 'Game XP today: ' + played + ' of ' + DAILY_GAME_REWARDS + '.');
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
    setText('game-done-text', text + (rewarded ? ' +' + GAME_XP + ' XP for your garden.' : ' Today\'s game XP is all gathered, so this round was just for fun.'));
    $('game-done').hidden = false;
    var again = $('game-again');
    if (again && again.focus) again.focus();
  }

  // Petal Pairs: a gentle memory match.
  function flowerSvg(color) {
    var s0 = document.createElementNS(SVGNS, 'svg');
    s0.setAttribute('viewBox', '0 0 40 40');
    s0.setAttribute('aria-hidden', 'true');
    miniFlower(s0, 20, 20, 12, color);
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
      b.appendChild(flowerSvg(FLOWERS[c.kind][1]));
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
          finishGame('All pairs bloomed', 'You matched 6 pairs in ' + plural(moves, 'move', 'moves') + (prev && moves < prev ? ', your best yet!' : '.'),
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

  // Breath Bloom: hold to breathe in with the ring, let go to breathe out.
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
    setText('game-score', '0 of ' + BLOOM_ROUNDS + ' blooms');
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
    setText('game-score', game.round + ' of ' + BLOOM_ROUNDS + ' blooms');
    if (game.round >= BLOOM_ROUNDS) endBloom();
  }
  function endBloom() {
    var pct = game.samples ? Math.round(game.inSync / game.samples * 100) : 0;
    var prev = state.gameBest.bloom || 0;
    finishGame('Six breaths, six blooms', 'You moved with the ring ' + pct + '% of the time. Every breath counted.',
      function () { if (pct > prev) state.gameBest.bloom = pct; });
  }
  function finishCurrentGame() {
    if (!game) return;
    if (game.id === 'pairs') {
      game.deck.forEach(function (c, i) { c.done = true; c.open = false; paintCard(i); });
      updatePairsScore();
      finishGame('All pairs bloomed', 'You matched 6 pairs in ' + plural(game.moves, 'move', 'moves') + '.');
    } else if (game.id === 'catch') endCatch();
    else endBloom();
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
    var spaceId = el.getAttribute('data-space');
    var moodV = el.getAttribute('data-mood');
    if (spaceId) { startCheckin('guided', spaceId); return; }
    if (moodV) { setMood(+moodV); return; }
    if (id === 'sos-alert') { sendSos(e); return; }
    if (gameId) { openGame(gameId); return; }
    if (card !== null) { flipCard(+card); return; }
    if (ctx) {
      // Toggle: pick as many feelings as apply. The first one picked stays the primary.
      flow.contexts = flow.contexts || [];
      var at = flow.contexts.indexOf(ctx);
      if (at === -1) flow.contexts.push(ctx); else flow.contexts.splice(at, 1);
      flow.context = flow.contexts[0] || null;
      el.setAttribute('aria-pressed', String(at === -1));
      setText('context-count', flow.contexts.length > 1 ? flow.contexts.length + ' picked' : '');
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
      case 'game-back': go('play'); break;
      case 'game-again': if (game) openGame(game.id); break;
      case 'start-break': startCheckin('guided'); break;
      case 'quick-breeze': startCheckin('quick'); break;
      case 'seed-pill': case 'open-shop': openShop(); break;
      case 'shop-close': case 'checkout-cancel': case 'support-close': case 'reset-cancel': closeSheets(); break;
      case 'shop-quick':
        closeSheets(true);
        if (current === 'pick') beginBreak('quick'); else startCheckin('quick');
        break;
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
      case 'context-all': flow.showAll = true; renderContextChips(); break;
      case 'step-done': doStep(); break;
      case 'support-card-step': if ($('steps-card').scrollIntoView) $('steps-card').scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
      case 'step-another': stepOffset++; renderSteps(); break;
      case 'jar-add': openJar(); break;
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
    $('good-text').addEventListener('input', onGoodInput);
    $('scrim').addEventListener('click', function () { closeSheets(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('scrim').hidden) closeSheets(); });
    addPetals($('orb-petals'), 0, 0, 1);
    addPetals($('rs-petals'), 180, 132, 0.9, 'rp');
    bindSlider('calm-before');
    bindSlider('calm-after');
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; if (current === 'me') renderInstall(); });
    window.addEventListener('appinstalled', function () { installEvt = null; toast('LoosenUp is on your home screen.'); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && current === 'today') renderGoldenBanner(); });
    renderIosTip();
    go(state.onboarded ? 'today' : 'welcome');
    registerSW();
    if (state.goldenHour) scheduleGoldenHour();
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
    level: function () { return level(); },
    recommend: recommend,
    recommendFor: recommendFor,
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
    techniques: TECH
  };

  // The script is deferred, so the DOM is ready; fall back to DOMContentLoaded if it is not.
  if (document.getElementById('tabbar')) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
