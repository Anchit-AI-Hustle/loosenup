/* LoosenUp 2.2: sleep player, web reminders, exercise length, weekly goal, breathing vibration,
   larger text, weekly reflection, private journal, support a friend, seasonal packs and the
   Trace the square game. Loads after app.js and builds its own screens, using window.LoosenUp.core. */
(function () {
  'use strict';
  var L = window.LoosenUp;
  var core = L && L.core;
  if (!core) return;
  var $ = function (id) { return document.getElementById(id); };
  var S = core.state; // live state object
  function mk(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function btn(text, cls, attrs) {
    var b = mk('button', cls || 'btn btn-soft', text);
    b.type = 'button';
    Object.keys(attrs || {}).forEach(function (k) { b.setAttribute(k, attrs[k]); });
    return b;
  }
  function addHi(map) { var hi = window.LoosenUpI18n && window.LoosenUpI18n.hi; if (hi) Object.keys(map).forEach(function (k) { hi[k] = map[k]; }); }
  function screen(id, eyebrow, title, intro) {
    var s = mk('section', 'screen tool-screen more-screen');
    s.id = 'screen-' + id;
    s.setAttribute('data-screen', id);
    s.setAttribute('aria-labelledby', id + '-title');
    s.hidden = true;
    s.appendChild(btn('Back', 'btn btn-ghost back-btn', { 'data-back': '' }));
    s.appendChild(mk('p', 'eyebrow', eyebrow));
    var h = mk('h1', 'title', title); h.id = id + '-title'; s.appendChild(h);
    if (intro) s.appendChild(mk('p', 'muted', intro));
    var home = $('screen-today');
    home.parentNode.appendChild(s);
    return s;
  }
  function tile(tool, icon, name, sub) {
    var t = mk('button', 'tool tool-more');
    t.type = 'button';
    t.setAttribute('data-more', tool);
    var ic = mk('span', 'tool-ic', icon); ic.setAttribute('aria-hidden', 'true');
    t.appendChild(ic); t.appendChild(mk('strong', null, name)); t.appendChild(mk('span', null, sub));
    return t;
  }
  function dk() { return core.dayKey(core.now()); }

  /* ---------- Sleep: guided sessions with voice, background sound, night dim and fade ---------- */
  var sleepRun = null;
  function lineSecs(text) { return Math.max(3, Math.round(text.split(/\s+/).length * 0.45 + 1)); }
  function sessionSecs(s) { return s.lines.reduce(function (a, l) { return a + lineSecs(l[0]) + l[1]; }, 0); }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function buildSleep() {
    var sc = screen('sleep', 'Wind down', 'Sleep', 'Guided sessions to help you drift off. Put the phone face down and let the voice guide you.');
    var list = mk('div', 'sleep-list'); list.id = 'sleep-list';
    (window.LoosenUpSleep || []).forEach(function (s) {
      var b = mk('button', 'sleep-card');
      b.type = 'button';
      b.setAttribute('data-sleep', s.id);
      b.appendChild(mk('span', 'sleep-kind', s.kind + ' · ' + s.mins + ' min'));
      b.appendChild(mk('strong', null, s.title[0]));
      b.appendChild(mk('span', 'sleep-desc', s.desc[0]));
      list.appendChild(b);
    });
    sc.appendChild(list);
    var p = mk('div', 'card sleep-player'); p.id = 'sleep-player'; p.hidden = true;
    var kind = mk('p', 'eyebrow'); kind.id = 'sp-kind'; p.appendChild(kind);
    var t = mk('h2', 'subtitle'); t.id = 'sp-title'; p.appendChild(t);
    var line = mk('p', 'sp-line'); line.id = 'sp-line'; line.setAttribute('aria-live', 'polite'); p.appendChild(line);
    var bar = mk('div', 'sp-bar'); var fill = mk('i'); fill.id = 'sp-fill'; bar.appendChild(fill); p.appendChild(bar);
    var time = mk('p', 'fine'); time.id = 'sp-time'; p.appendChild(time);
    var row = mk('div', 'row');
    row.appendChild(btn('Pause', 'btn btn-soft', { id: 'sp-pause' }));
    row.appendChild(btn('Stop', 'btn btn-ghost', { id: 'sp-stop' }));
    p.appendChild(row);
    p.appendChild(mk('p', 'field-label', 'After the session'));
    var after = mk('div', 'chips'); after.setAttribute('role', 'group'); after.setAttribute('aria-label', 'After the session');
    [['0', 'Fade to silence'], ['15', 'Sound for 15 min'], ['30', 'Sound for 30 min']].forEach(function (a) {
      after.appendChild(btn(a[1], 'chip', { 'data-sleep-after': a[0], 'aria-pressed': String(a[0] === '15') }));
    });
    p.appendChild(after);
    sc.appendChild(p);
    core.register('sleep', function () { $('sleep-list').hidden = !!sleepRun; $('sleep-player').hidden = !sleepRun; });
  }
  function sleepStart(id) {
    var s = (window.LoosenUpSleep || []).filter(function (x) { return x.id === id; })[0];
    if (!s) return false;
    sleepStop(true);
    var st = S();
    sleepRun = { s: s, i: -1, lineLeft: 0, elapsed: 0, total: sessionSecs(s), paused: false, after: st.sleepAfter == null ? 15 : st.sleepAfter };
    core.go('sleep');
    $('sleep-list').hidden = true;
    $('sleep-player').hidden = false;
    core.setText('sp-kind', s.kind + ' · ' + s.mins + ' min');
    core.setText('sp-title', s.title[0]);
    document.documentElement.classList.add('sleep-dim');
    core.playSound(s.sound, 0.22);
    sleepRun.timer = setInterval(sleepTick, 1000);
    nextLine();
    return true;
  }
  function nextLine() {
    var r = sleepRun;
    r.i++;
    if (r.i >= r.s.lines.length) { sleepEnd(); return; }
    var l = r.s.lines[r.i];
    r.lineLeft = lineSecs(l[0]) + l[1];
    core.setText('sp-line', l[0]);
    core.speak(l[0], false, true);
    sleepProgress();
  }
  function sleepProgress() {
    var r = sleepRun;
    $('sp-fill').style.width = Math.min(100, Math.round(100 * r.elapsed / r.total)) + '%';
    core.setText('sp-time', fmt(r.total - r.elapsed) + ' left');
  }
  function sleepTick() {
    var r = sleepRun;
    if (!r || r.paused) return;
    r.elapsed++;
    r.lineLeft--;
    if (r.lineLeft <= 0) nextLine(); else sleepProgress();
  }
  function sleepEnd() {
    var r = sleepRun;
    clearInterval(r.timer);
    core.setText('sp-line', 'Sleep well.');
    core.setText('sp-time', r.after ? 'Sound keeps playing for ' + r.after + ' min, then fades.' : 'Fading to silence.');
    $('sp-fill').style.width = '100%';
    if (r.after) r.fadeTimer = setTimeout(function () { core.fadeSound(30); }, r.after * 60000);
    else core.fadeSound(30);
    r.done = true;
  }
  function sleepStop(quiet) {
    if (!sleepRun) return;
    clearInterval(sleepRun.timer);
    clearTimeout(sleepRun.fadeTimer);
    sleepRun = null;
    core.stopVoice();
    core.stopSound(false);
    document.documentElement.classList.remove('sleep-dim');
    if (!quiet && $('sleep-list')) { $('sleep-list').hidden = false; $('sleep-player').hidden = true; }
  }
  function sleepPause() {
    if (!sleepRun || sleepRun.done) return;
    sleepRun.paused = !sleepRun.paused;
    core.setText('sp-pause', sleepRun.paused ? 'Resume' : 'Pause');
    if (sleepRun.paused) core.stopVoice();
  }

  /* ---------- Web reminders: real notifications for the website and mobile website ---------- */
  var PUSH_API = core.publicUrl + '/api/push';
  function pushSupported() {
    return !core.isNative() && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && typeof fetch === 'function';
  }
  function b64ToBytes(s) {
    var pad = '='.repeat((4 - s.length % 4) % 4);
    var raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  function pushStatus(t) { if ($('push-status')) core.setText('push-status', t); }
  function subscribePush(time) {
    if (!pushSupported()) return Promise.resolve(false);
    return Notification.requestPermission().then(function (perm) {
      if (perm !== 'granted') { pushStatus('Notifications are off for this site. The in-app note still works.'); return false; }
      return Promise.all([navigator.serviceWorker.ready, fetch(PUSH_API + '?action=key').then(function (r) { return r.json(); })])
        .then(function (res) {
          var reg = res[0], key = res[1] && res[1].publicKey;
          if (!key) throw new Error('no key');
          return reg.pushManager.getSubscription().then(function (old) {
            return old || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(key) });
          });
        })
        .then(function (sub) {
          return fetch(PUSH_API, { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'subscribe', subscription: sub.toJSON ? sub.toJSON() : sub, time: time, tz: -new Date().getTimezoneOffset(), lang: S().lang || 'en' }) });
        })
        .then(function (r) { if (!r.ok) throw new Error('subscribe'); pushStatus('A notification will arrive each day at ' + time + '.'); return true; })
        .catch(function () { pushStatus('Notifications could not be set up here. The in-app note still works.'); return false; });
    });
  }
  function unsubscribePush() {
    if (!pushSupported()) return Promise.resolve(false);
    return navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
      if (!sub) return false;
      fetch(PUSH_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'unsubscribe', endpoint: sub.endpoint }) }).catch(function () {});
      return sub.unsubscribe();
    }).then(function () { pushStatus(''); return true; }).catch(function () { return false; });
  }
  function buildPush() {
    var help = $('golden-help');
    if (!help || !pushSupported()) return;
    var p = mk('p', 'fine'); p.id = 'push-status'; p.setAttribute('aria-live', 'polite');
    help.parentNode.insertBefore(p, help.nextSibling);
  }

  /* ---------- Exercise length ---------- */
  var LENGTHS = [1, 2, 3, 5, 10];
  function buildLength() {
    var panel = $('panel-breathe');
    if (!panel) return;
    var wrap = mk('div', 'length-row');
    wrap.appendChild(mk('span', 'field-label', 'Length'));
    var chips = mk('div', 'chips'); chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Length');
    LENGTHS.forEach(function (m) { chips.appendChild(btn(m + ' min', 'chip', { 'data-length': String(m), 'aria-pressed': 'false' })); });
    wrap.appendChild(chips);
    panel.insertBefore(wrap, panel.firstChild);
    renderLength();
  }
  function renderLength() {
    var cur = S().lengthMin || 2;
    var b = document.querySelectorAll('[data-length]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', String(+b[i].getAttribute('data-length') === cur));
  }
  function setLength(m) { S().lengthMin = LENGTHS.indexOf(m) !== -1 ? m : 2; core.save(); renderLength(); }

  /* ---------- Weekly goal, comfort settings, reflection ---------- */
  function buildGoal() {
    var prog = $('screen-progress');
    if (!prog) return;
    var card = mk('article', 'card goal-card'); card.id = 'goal-card';
    card.appendChild(mk('h2', 'subtitle', 'Your weekly goal'));
    var p = mk('p', 'goal-line'); p.id = 'goal-line'; card.appendChild(p);
    var bar = mk('div', 'goal-days'); bar.id = 'goal-days'; card.appendChild(bar);
    card.appendChild(mk('p', 'field-label', 'Days a week'));
    var chips = mk('div', 'chips'); chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Days a week');
    for (var d = 1; d <= 7; d++) chips.appendChild(btn(String(d), 'chip', { 'data-goal': String(d), 'aria-pressed': 'false' }));
    card.appendChild(chips);
    card.appendChild(mk('p', 'fine', 'A gentle target, not a streak. Quiet days never reset anything.'));
    var reflect = mk('article', 'card reflect-card'); reflect.id = 'reflect-card';
    reflect.appendChild(mk('h2', 'subtitle', 'Your week in a glance'));
    var ul = mk('ul', 'reflect-list'); ul.id = 'reflect-list'; reflect.appendChild(ul);
    var h1 = prog.querySelector('h1');
    prog.insertBefore(reflect, h1.nextSibling);
    prog.insertBefore(card, h1.nextSibling);
  }
  function renderGoal() {
    if (!$('goal-card')) return;
    var g = core.weekGoal();
    core.setText('goal-line', g.days >= g.goal ? 'Goal met: ' + g.days + ' of ' + g.goal + ' days this week. Lovely.' : g.days + ' of ' + g.goal + ' days this week.');
    var bar = $('goal-days'); bar.textContent = '';
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d, i) {
      var c = mk('span', 'gday' + (g.week[i] ? ' on' : ''), d);
      bar.appendChild(c);
    });
    var b = document.querySelectorAll('[data-goal]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', String(+b[i].getAttribute('data-goal') === g.goal));
    renderReflect(g);
  }
  function renderReflect(g) {
    var ul = $('reflect-list');
    if (!ul) return;
    ul.textContent = '';
    var items = [];
    var wk = core.weekKey(core.now());
    var ses = S().sessions.filter(function (x) { return core.weekKey(new Date(x.ts)) === wk; });
    items.push(g.days + ' of ' + g.goal + ' days with a calm break.');
    if (ses.length) {
      var by = {};
      ses.forEach(function (x) { var e = by[x.technique] || (by[x.technique] = { n: 0, sum: 0 }); e.n++; e.sum += Math.max(0, x.gain); });
      var best = Object.keys(by).sort(function (a, b) { return by[b].sum / by[b].n - by[a].sum / by[a].n; })[0];
      if (best && core.TECH[best]) items.push('What helped most: ' + core.TECH[best].name + '.');
    }
    var em = (L.emotionStats ? L.emotionStats() : []).filter(function (x) { return x.hard; })[0];
    if (em) items.push('Came up most: ' + em.name + '.');
    items.push(!ses.length ? 'Next week: try one two-minute break on a busy day.' : g.days < g.goal ? 'Next week: a Quick breeze on a busy day still counts.' : 'Next week: keep the rhythm that is working.');
    items.forEach(function (t) { ul.appendChild(mk('li', null, t)); });
  }
  function setGoal(n) { S().weeklyGoal = Math.max(1, Math.min(7, n)); core.save(); renderGoal(); }

  function buildComfort() {
    var voice = $('voice-toggle');
    // Only where the phone can vibrate: the apps, and browsers with vibration (Safari on iPhone has none).
    var canVibrate = core.isNative() || typeof navigator.vibrate === 'function';
    if (voice && canVibrate) {
      var hb = btn('Breathing vibration: off', 'btn btn-soft', { id: 'haptic-toggle', 'aria-pressed': 'false' });
      voice.parentNode.insertBefore(hb, voice.nextSibling);
      var note = mk('p', 'fine', 'Feel the rhythm with your eyes closed: gentle pulses on the breath in, one long pulse on the breath out.');
      voice.parentNode.insertBefore(note, hb.nextSibling);
    }
    var theme = document.querySelector('[data-theme-choice]');
    if (theme) {
      var card = theme.closest('.card');
      card.appendChild(mk('p', 'field-label', 'Text size'));
      var chips = mk('div', 'chips'); chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Text size');
      [['normal', 'Normal'], ['large', 'Large'], ['larger', 'Larger']].forEach(function (t) { chips.appendChild(btn(t[1], 'chip', { 'data-textsize': t[0], 'aria-pressed': 'false' })); });
      card.appendChild(chips);
    }
    applyComfort();
  }
  function applyComfort() {
    var st = S();
    var size = st.textSize || 'normal';
    document.documentElement.classList.toggle('text-large', size === 'large');
    document.documentElement.classList.toggle('text-larger', size === 'larger');
    var b = document.querySelectorAll('[data-textsize]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', String(b[i].getAttribute('data-textsize') === size));
    if ($('haptic-toggle')) { core.setText('haptic-toggle', 'Breathing vibration: ' + (st.hapticBreath ? 'on' : 'off')); $('haptic-toggle').setAttribute('aria-pressed', String(!!st.hapticBreath)); }
  }
  function vibrate(pattern) {
    try {
      var H = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
      if (H && core.isNative()) {
        // Short pulses are light taps; a long pulse is one firm vibration.
        var t = 0;
        pattern.forEach(function (ms, i) {
          if (i % 2 === 0) setTimeout(function () { if (ms < 100) H.impact({ style: ms < 45 ? 'LIGHT' : 'MEDIUM' }); else H.vibrate({ duration: ms }); }, t);
          t += ms;
        });
        return true;
      }
      if (navigator.vibrate) return navigator.vibrate(pattern);
    } catch (e) { /* no vibration here */ }
    return false;
  }
  // Paces the breath by touch: rising pulses breathing in, one long pulse breathing out.
  function onPhase(e) {
    if (!S().hapticBreath || !e.detail) return;
    var d = e.detail, ms = d.secs * 1000;
    if (d.kind === 'in') { var p = [], t = 0, gap = 420; while (t + gap < ms) { p.push(25 + Math.round(35 * t / ms), gap); t += gap + 25; } vibrate(p); }
    else if (d.kind === 'out') vibrate([180]);
  }

  /* ---------- Private journal ---------- */
  var PROMPTS = ['What is on your mind right now?', 'What felt heavy today, and what helped even a little?', 'Name one thing you handled well this week.',
    'What would you tell a friend who felt the way you do?', 'What do you need more of tomorrow?', 'Who or what made you smile recently?'];
  function buildJournal() {
    var sc = screen('journal', 'Only on this phone', 'Journal', 'Write freely. Entries stay on this phone and are saved only when you tap Save. Turn on App lock in Me to keep them private.');
    var card = mk('article', 'card');
    var pr = mk('p', 'journal-prompt'); pr.id = 'journal-prompt'; card.appendChild(pr);
    card.appendChild(btn('Another prompt', 'btn btn-ghost btn-small', { id: 'journal-another' }));
    var ta = mk('textarea', 'journal'); ta.id = 'journal-text'; ta.rows = 7; ta.setAttribute('aria-label', 'Journal entry'); ta.setAttribute('maxlength', '4000');
    card.appendChild(ta);
    card.appendChild(btn('Save', 'btn btn-sun', { id: 'journal-save' }));
    sc.appendChild(card);
    sc.appendChild(mk('h2', 'subtitle', 'Your entries'));
    var list = mk('div', 'journal-list'); list.id = 'journal-list'; sc.appendChild(list);
    var empty = mk('p', 'fine', 'Your saved entries will appear here.'); empty.id = 'journal-empty'; sc.appendChild(empty);
    core.register('journal', renderJournal);
  }
  var promptIdx = 0;
  function renderJournal() {
    core.setText('journal-prompt', PROMPTS[promptIdx % PROMPTS.length]);
    var list = $('journal-list'); list.textContent = '';
    var entries = S().journal || [];
    $('journal-empty').hidden = !!entries.length;
    entries.slice(0, 40).forEach(function (en) {
      var c = mk('article', 'journal-entry');
      c.setAttribute('data-no-tr', '');
      c.appendChild(mk('p', 'fine', en.day + ' · ' + en.prompt));
      c.appendChild(mk('p', 'journal-body', en.text));
      c.appendChild(btn('Delete', 'btn btn-ghost btn-small', { 'data-jdel': en.id }));
      list.appendChild(c);
    });
  }
  function saveJournal() {
    var ta = $('journal-text');
    var text = (ta.value || '').trim();
    if (!text) { core.toast('Write a few words first. Any words are welcome.'); return false; }
    if (core.isCrisis(text)) { core.openSupport(); }
    var st = S();
    st.journal = st.journal || [];
    st.journal.unshift({ id: String(Date.now()), day: dk(), prompt: PROMPTS[promptIdx % PROMPTS.length], text: text.slice(0, 4000) });
    if (st.journal.length > 300) st.journal = st.journal.slice(0, 300);
    core.save();
    ta.value = '';
    renderJournal();
    core.toast('Saved on this phone.');
    return true;
  }
  function deleteJournal(id) { var st = S(); st.journal = (st.journal || []).filter(function (e) { return e.id !== id; }); core.save(); renderJournal(); }

  /* ---------- Support a friend ---------- */
  function buildFriend() {
    var sc = screen('friend', 'Someone you care about', 'Support a friend', 'What to say, how to ask, and where to get help together.');
    [
      ['1. Notice', 'Pulling away, sleeping much more or less, giving things away, or saying they feel like a burden can all be signs someone is struggling.'],
      ['2. Listen without fixing', 'Try: "That sounds really hard. I am here." Let them talk. Silence is okay.'],
      ['3. Ask directly', 'If you are worried, ask: "Are you thinking about ending your life?" Asking does not put the idea in their head, and it can be a huge relief.'],
      ['4. Get help together', 'Offer to call Tele-MANAS on 14416 with them, or help them find a counsellor. If they might act on it now, call 112 and stay with them.']
    ].forEach(function (s) {
      var c = mk('article', 'card friend-step');
      c.appendChild(mk('h2', 'subtitle', s[0]));
      c.appendChild(mk('p', null, s[1]));
      sc.appendChild(c);
    });
    var row = mk('div', 'friend-actions');
    var call = mk('a', 'btn btn-sun', 'Call Tele-MANAS 14416'); call.href = 'tel:14416'; row.appendChild(call);
    row.appendChild(btn('Share helplines with them', 'btn btn-soft', { id: 'friend-share' }));
    var e112 = mk('a', 'btn btn-sos', 'Emergency: call 112'); e112.href = 'tel:112'; row.appendChild(e112);
    sc.appendChild(row);
  }
  function shareHelplines() {
    var text = 'You do not have to carry this alone. Free and confidential help in India: Tele-MANAS 14416 (24x7), Vandrevala Foundation +91 9999 666 555 (24x7, call or WhatsApp), iCall 9152987821 (Mon to Sat). In an emergency, call 112.';
    if (navigator.share) return navigator.share({ title: 'Help is here', text: core.tr(text) }).catch(function () {});
    if (navigator.clipboard) return navigator.clipboard.writeText(core.tr(text)).then(function () { core.toast('Copied. Paste it into a message to them.'); });
    core.toast(text);
    return Promise.resolve();
  }

  /* ---------- Seasonal packs for India ---------- */
  var PACKS = [
    { id: 'exams', name: 'Board exam weeks', months: [1, 2, 3], icon: '📚', desc: 'Steady focus, good sleep and kind self-talk through exam season.',
      items: [['practice', 'square', 'Steady square before each study round'], ['program', 'exam', 'Exam calm, a 14 day programme'], ['lesson', 'thoughts', 'Thoughts are guesses, not facts'], ['sleep', 'scan', 'Body scan for sleep']] },
    { id: 'appraisal', name: 'Appraisal season', months: [3, 4], icon: '💼', desc: 'For the weeks of reviews, targets and tough conversations at work.',
      items: [['practice', 'desk', 'Desk reset between meetings'], ['practice', 'pause', 'Pause before replying'], ['lesson', 'work', 'Boundaries that protect your energy'], ['program', 'burnout', 'Recovering from burnout']] },
    { id: 'monsoon', name: 'Monsoon low days', months: [6, 7, 8, 9], icon: '🌧️', desc: 'Grey skies and indoor days: small lifts for a heavier mood.',
      items: [['practice', 'kind', 'Kind words'], ['practice', 'breeze', 'Slow breeze'], ['lesson', 'steps', 'On heavy days, action comes first'], ['sleep', 'monsoon', 'Monsoon evening on the verandah']] },
    { id: 'festivals', name: 'Festival season with family', months: [10, 11], icon: '🪔', desc: 'Joy, crowds, travel and family time: stay steady and kind to yourself.',
      items: [['practice', 'cooldown', 'Cool down after a disagreement'], ['practice', 'warmth', 'Warm wishes for family'], ['lesson', 'repair', 'Repair after a disagreement'], ['practice', 'sigh', 'Sigh of relief in a crowd']] }
  ];
  function inSeason() { var m = core.now().getMonth() + 1; return PACKS.filter(function (p) { return p.months.indexOf(m) !== -1; })[0] || null; }
  function buildPacks() {
    var sc = screen('packs', 'For the season', 'Seasonal packs', 'Ready-made sets of exercises, lessons and sleep sessions for the moments India shares.');
    var list = mk('div', 'pack-list'); list.id = 'pack-list'; sc.appendChild(list);
    core.register('packs', renderPacks);
  }
  function renderPacks() {
    var list = $('pack-list'); list.textContent = '';
    var cur = inSeason();
    PACKS.forEach(function (p) {
      var c = mk('article', 'card pack-card' + (cur && cur.id === p.id ? ' now' : ''));
      var head = mk('div', 'pack-head');
      var ic = mk('span', 'pack-ic', p.icon); ic.setAttribute('aria-hidden', 'true'); head.appendChild(ic);
      head.appendChild(mk('h2', 'subtitle', p.name));
      if (cur && cur.id === p.id) head.appendChild(mk('span', 'tag', 'In season'));
      c.appendChild(head);
      c.appendChild(mk('p', 'muted', p.desc));
      p.items.forEach(function (it) { c.appendChild(btn(it[2], 'btn btn-soft pack-item', { 'data-pack-item': it[0] + ':' + it[1] })); });
      list.appendChild(c);
    });
  }
  function openPackItem(v) {
    var p = v.split(':');
    if (p[0] === 'practice') core.startPractice(p[1]);
    else if (p[0] === 'program') L.openProgram(p[1]);
    else if (p[0] === 'lesson') L.openLesson(p[1]);
    else if (p[0] === 'sleep') sleepStart(p[1]);
  }
  function buildSeasonCard() {
    var cur = inSeason();
    var row = $('more-row-kit');
    if (!cur || !row) return;
    var c = mk('button', 'card season-card');
    c.type = 'button';
    c.setAttribute('data-more', 'packs');
    var ic = mk('span', 'pack-ic', cur.icon); ic.setAttribute('aria-hidden', 'true'); c.appendChild(ic);
    var tx = mk('span', 'season-text');
    tx.appendChild(mk('strong', null, cur.name));
    tx.appendChild(mk('span', null, 'A ready-made set for this season'));
    c.appendChild(tx);
    row.parentNode.insertBefore(c, row);
  }

  /* ---------- Trace the square: box breathing by following a dot with your finger ---------- */
  var trace = null;
  var SIDE = 4, ROUNDS = 3;
  function buildTrace() {
    var sc = screen('trace', 'Calm game', 'Trace the square', 'Keep your finger on the glowing dot as it travels round the square. Breathe in up the side, hold across the top, out down the side, rest along the bottom.');
    var wrap = mk('div', 'trace-wrap');
    wrap.innerHTML = '<svg id="trace-svg" class="trace-svg" viewBox="0 0 220 220" aria-label="Trace the square"><rect x="30" y="30" width="160" height="160" rx="14" class="trace-path"/><circle id="trace-dot" cx="30" cy="190" r="13" class="trace-dot"/><circle id="trace-finger" cx="-50" cy="-50" r="9" class="trace-finger"/></svg>';
    sc.appendChild(wrap);
    var ph = mk('p', 'cue'); ph.id = 'trace-phase'; sc.appendChild(ph);
    var sc2 = mk('p', 'round-count'); sc2.id = 'trace-score'; sc.appendChild(sc2);
    sc.appendChild(btn('Start', 'btn btn-sun', { id: 'trace-start' }));
    core.register('trace', function () { if (!trace) { core.setText('trace-phase', 'Place your finger on the dot, then tap Start.'); core.setText('trace-score', ''); } });
    var svg = $('trace-svg');
    var move = function (e) {
      if (!trace) return;
      var r = svg.getBoundingClientRect();
      var pt = e.touches ? e.touches[0] : e;
      trace.fx = (pt.clientX - r.left) * 220 / r.width;
      trace.fy = (pt.clientY - r.top) * 220 / r.height;
      trace.down = true;
      e.preventDefault && e.cancelable && e.preventDefault();
    };
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerup', function () { if (trace) trace.down = false; });
    svg.addEventListener('pointerleave', function () { if (trace) trace.down = false; });
  }
  function dotAt(t) {
    // Corners: bottom left, top left, top right, bottom right. One side per SIDE seconds.
    var side = Math.floor(t / SIDE) % 4, f = (t % SIDE) / SIDE;
    var P = [[30, 190], [30, 30], [190, 30], [190, 190]];
    var a = P[side], b = P[(side + 1) % 4];
    return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, side: side };
  }
  var PHASES = ['Breathe in', 'Hold', 'Breathe out', 'Rest'];
  function traceStart() {
    traceStop();
    trace = { t0: Date.now(), near: 0, frames: 0, side: -1, fx: -50, fy: -50, down: false };
    core.setText('trace-start', 'Restart');
    var step = function () {
      if (!trace) return;
      var t = (Date.now() - trace.t0) / 1000;
      if (t >= SIDE * 4 * ROUNDS) { traceEnd(); return; }
      var d = dotAt(t);
      $('trace-dot').setAttribute('cx', d.x.toFixed(1)); $('trace-dot').setAttribute('cy', d.y.toFixed(1));
      $('trace-finger').setAttribute('cx', trace.fx.toFixed(1)); $('trace-finger').setAttribute('cy', trace.fy.toFixed(1));
      if (d.side !== trace.side) { trace.side = d.side; core.setText('trace-phase', PHASES[d.side]); }
      trace.frames++;
      if (trace.down && Math.hypot(trace.fx - d.x, trace.fy - d.y) < 26) trace.near++;
      core.setText('trace-score', 'Round ' + (Math.floor(t / (SIDE * 4)) + 1) + ' of ' + ROUNDS);
      trace.raf = (window.requestAnimationFrame || function (f) { return setTimeout(f, 40); })(step);
    };
    step();
  }
  function traceEnd() {
    var pct = trace.frames ? Math.round(100 * trace.near / trace.frames) : 0;
    traceStop();
    core.setText('trace-phase', 'Three calm squares done.');
    core.setText('trace-score', 'You stayed with the dot ' + pct + '% of the time. Every breath counted.');
    core.addBadge('playful');
    return pct;
  }
  function traceStop() {
    if (!trace) return;
    if (trace.raf) (window.cancelAnimationFrame || clearTimeout)(trace.raf);
    trace = null;
  }
  function buildTraceTiles() {
    var row = document.querySelector('#screen-today .game-row');
    if (row) {
      var t = mk('button', 'game-tile gt-trace'); t.type = 'button'; t.setAttribute('data-more', 'trace');
      var ic = mk('span', 'gt-ic', '🟦'); ic.setAttribute('aria-hidden', 'true'); t.appendChild(ic);
      t.appendChild(mk('strong', null, 'Trace the square')); t.appendChild(mk('span', null, 'Follow the dot'));
      row.appendChild(t);
    }
    var games = document.querySelector('#panel-games .games');
    if (games) {
      var c = mk('button', 'game-card'); c.type = 'button'; c.setAttribute('data-more', 'trace');
      var art = mk('span', 'game-art', '🟦'); art.setAttribute('aria-hidden', 'true'); c.appendChild(art);
      var tx = mk('span'); tx.appendChild(mk('strong', null, 'Trace the square')); tx.appendChild(mk('span', null, 'Follow the dot round the square as you breathe.'));
      c.appendChild(tx);
      games.appendChild(c);
    }
  }

  /* ---------- Entry points and events ---------- */
  function buildTiles() {
    // A visible row on Today, right under the games, so sleep and the journal are one tap away.
    var games = document.querySelector('#screen-today .game-row');
    var block = games && games.closest('section');
    if (block) {
      var sec = mk('section', 'block more-row');
      sec.setAttribute('aria-labelledby', 'more-row-title');
      var head = mk('div', 'block-head');
      var h = mk('h2', 'subtitle', 'Sleep, journal and more'); h.id = 'more-row-title'; head.appendChild(h);
      sec.appendChild(head);
      var kit = mk('div', 'toolkit'); kit.id = 'more-row-kit';
      kit.appendChild(tile('sleep', '☾', 'Sleep', 'Body scan, yoga nidra, stories'));
      kit.appendChild(tile('journal', '✎', 'Journal', 'Private, on this phone'));
      kit.appendChild(tile('friend', '♡', 'Support a friend', 'What to say and do'));
      kit.appendChild(tile('packs', '✦', 'Seasonal packs', 'Exams, festivals, monsoon'));
      sec.appendChild(kit);
      block.parentNode.insertBefore(sec, block.nextSibling);
    }
    var sounds = $('panel-sounds');
    if (sounds) {
      var b = btn('Guided sleep sessions', 'btn btn-sun', { 'data-more': 'sleep' });
      sounds.insertBefore(b, sounds.firstChild);
    }
  }
  function onClick(e) {
    var el = e.target.closest && e.target.closest('button, a');
    if (!el) return;
    var more = el.getAttribute('data-more');
    if (more) { core.go(more); return; }
    var sl = el.getAttribute('data-sleep');
    if (sl) { sleepStart(sl); return; }
    var after = el.getAttribute('data-sleep-after');
    if (after !== null) {
      S().sleepAfter = +after; core.save();
      var b = document.querySelectorAll('[data-sleep-after]');
      for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', String(b[i] === el));
      if (sleepRun) sleepRun.after = +after;
      return;
    }
    var len = el.getAttribute('data-length');
    if (len) { setLength(+len); return; }
    var goal = el.getAttribute('data-goal');
    if (goal) { setGoal(+goal); return; }
    var ts = el.getAttribute('data-textsize');
    if (ts) { S().textSize = ts; core.save(); applyComfort(); return; }
    var jd = el.getAttribute('data-jdel');
    if (jd) { deleteJournal(jd); return; }
    var pi = el.getAttribute('data-pack-item');
    if (pi) { openPackItem(pi); return; }
    switch (el.id) {
      case 'sp-pause': sleepPause(); break;
      case 'sp-stop': sleepStop(); break;
      case 'haptic-toggle': S().hapticBreath = !S().hapticBreath; core.save(); applyComfort(); if (S().hapticBreath) vibrate([60, 120, 60]); break;
      case 'journal-save': saveJournal(); break;
      case 'journal-another': promptIdx++; renderJournal(); break;
      case 'friend-share': shareHelplines(); break;
      case 'trace-start': traceStart(); break;
      case 'golden-save': setTimeout(function () { if (S().goldenHour) subscribePush(S().goldenHour); }, 0); break;
      case 'golden-clear': setTimeout(unsubscribePush, 0); break;
    }
    if (el.hasAttribute('data-back')) { if (sleepRun && !sleepRun.done) sleepStop(); traceStop(); }
  }

  addHi({
    'Wind down': 'आराम की ओर', 'Sleep': 'नींद', 'Guided sessions to help you drift off. Put the phone face down and let the voice guide you.': 'नींद में धीरे से उतरने के लिए गाइडेड सेशन। फ़ोन उल्टा रख दें और आवाज़ को राह दिखाने दें।',
    'Pause': 'रुकें', 'Resume': 'फिर शुरू करें', 'Stop': 'रोकें', 'After the session': 'सेशन के बाद', 'Fade to silence': 'धीरे से चुप', 'Sound for 15 min': '15 मिनट आवाज़', 'Sound for 30 min': '30 मिनट आवाज़',
    'Sleep well.': 'अच्छी नींद लें।', 'Fading to silence.': 'आवाज़ धीरे धीरे बंद हो रही है।', 'Guided sleep sessions': 'गाइडेड नींद सेशन',
    'Notifications are off for this site. The in-app note still works.': 'इस साइट के लिए नोटिफ़िकेशन बंद हैं। ऐप के अंदर का संदेश अब भी काम करता है।',
    'Notifications could not be set up here. The in-app note still works.': 'यहाँ नोटिफ़िकेशन सेट नहीं हो सके। ऐप के अंदर का संदेश अब भी काम करता है।',
    'Length': 'अवधि', 'Your weekly goal': 'आपका हफ़्ते का लक्ष्य', 'Days a week': 'हफ़्ते में दिन',
    'A gentle target, not a streak. Quiet days never reset anything.': 'एक कोमल लक्ष्य, कोई लगातार गिनती नहीं। शांत दिनों से कुछ भी रीसेट नहीं होता।',
    'Your week in a glance': 'एक नज़र में आपका हफ़्ता', 'Next week: try one two-minute break on a busy day.': 'अगले हफ़्ते: किसी व्यस्त दिन एक दो मिनट का ब्रेक आज़माएँ।',
    'Next week: a Quick breeze on a busy day still counts.': 'अगले हफ़्ते: व्यस्त दिन पर एक Quick breeze भी गिना जाता है।', 'Next week: keep the rhythm that is working.': 'अगले हफ़्ते: जो लय काम कर रही है, उसे जारी रखें।',
    'Text size': 'अक्षरों का आकार', 'Normal': 'सामान्य', 'Large': 'बड़ा', 'Larger': 'और बड़ा',
    'Feel the rhythm with your eyes closed: gentle pulses on the breath in, one long pulse on the breath out.': 'आँखें बंद करके लय महसूस करें: साँस लेते समय हल्के झटके, छोड़ते समय एक लंबा झटका।',
    'Only on this phone': 'सिर्फ़ इसी फ़ोन पर', 'Journal': 'डायरी', 'Write freely. Entries stay on this phone and are saved only when you tap Save. Turn on App lock in Me to keep them private.': 'खुलकर लिखें। एंट्री इसी फ़ोन पर रहती हैं और तभी सेव होती हैं जब आप सेव दबाएँ। इन्हें निजी रखने के लिए मैं में ऐप लॉक चालू करें।',
    'Another prompt': 'कोई और सवाल', 'Journal entry': 'डायरी एंट्री', 'Your entries': 'आपकी एंट्री', 'Your saved entries will appear here.': 'आपकी सेव की गई एंट्री यहाँ दिखेंगी।', 'Delete': 'मिटाएँ',
    'What is on your mind right now?': 'इस समय आपके मन में क्या है?', 'What felt heavy today, and what helped even a little?': 'आज क्या भारी लगा, और किस चीज़ ने थोड़ी भी मदद की?',
    'Name one thing you handled well this week.': 'इस हफ़्ते की एक चीज़ बताएँ जो आपने अच्छे से सँभाली।', 'What would you tell a friend who felt the way you do?': 'आप जैसा महसूस करने वाले किसी दोस्त से आप क्या कहते?',
    'What do you need more of tomorrow?': 'कल आपको किस चीज़ की ज़्यादा ज़रूरत है?', 'Who or what made you smile recently?': 'हाल में किसने या किस चीज़ ने आपको मुस्कुराया?',
    'Someone you care about': 'कोई जिसकी आपको परवाह है', 'Support a friend': 'किसी दोस्त का साथ दें', 'What to say, how to ask, and where to get help together.': 'क्या कहें, कैसे पूछें, और साथ मिलकर मदद कहाँ लें।',
    '1. Notice': '1. ध्यान दें', '2. Listen without fixing': '2. बिना हल सुझाए सुनें', '3. Ask directly': '3. सीधे पूछें', '4. Get help together': '4. साथ मिलकर मदद लें',
    'Pulling away, sleeping much more or less, giving things away, or saying they feel like a burden can all be signs someone is struggling.': 'दूर होते जाना, बहुत ज़्यादा या बहुत कम सोना, चीज़ें दे देना, या खुद को बोझ कहना, ये सब संकेत हो सकते हैं कि कोई मुश्किल में है।',
    'Try: "That sounds really hard. I am here." Let them talk. Silence is okay.': 'कहकर देखें: "यह सच में बहुत मुश्किल लगता है। मैं यहाँ हूँ।" उन्हें बोलने दें। चुप्पी भी ठीक है।',
    'If you are worried, ask: "Are you thinking about ending your life?" Asking does not put the idea in their head, and it can be a huge relief.': 'अगर आपको फ़िक्र है, तो पूछें: "क्या तुम अपनी जान लेने के बारे में सोच रहे हो?" पूछने से यह विचार उनके मन में नहीं आता, और इससे बहुत राहत मिल सकती है।',
    'Offer to call Tele-MANAS on 14416 with them, or help them find a counsellor. If they might act on it now, call 112 and stay with them.': 'उनके साथ Tele-MANAS को 14416 पर कॉल करने की पेशकश करें, या काउंसलर खोजने में मदद करें। अगर वे अभी कुछ कर सकते हैं, तो 112 पर कॉल करें और उनके साथ रहें।',
    'Call Tele-MANAS 14416': 'Tele-MANAS 14416 पर कॉल करें', 'Share helplines with them': 'उनके साथ हेल्पलाइन शेयर करें', 'Copied. Paste it into a message to them.': 'कॉपी हो गया। इसे उनके संदेश में चिपकाएँ।',
    'You do not have to carry this alone. Free and confidential help in India: Tele-MANAS 14416 (24x7), Vandrevala Foundation +91 9999 666 555 (24x7, call or WhatsApp), iCall 9152987821 (Mon to Sat). In an emergency, call 112.':
      'आपको यह अकेले नहीं उठाना है। भारत में मुफ़्त और गोपनीय मदद: Tele-MANAS 14416 (24x7), Vandrevala Foundation +91 9999 666 555 (24x7, कॉल या WhatsApp), iCall 9152987821 (सोम से शनि)। आपातकाल में 112 पर कॉल करें।',
    'Help is here': 'मदद यहाँ है', 'For the season': 'इस मौसम के लिए', 'Seasonal packs': 'मौसमी पैक', 'Ready-made sets of exercises, lessons and sleep sessions for the moments India shares.': 'उन पलों के लिए अभ्यास, पाठ और नींद सेशन के तैयार सेट, जो पूरा भारत साझा करता है।',
    'In season': 'इस मौसम में', 'A ready-made set for this season': 'इस मौसम के लिए एक तैयार सेट',
    'Board exam weeks': 'बोर्ड परीक्षा के हफ़्ते', 'Steady focus, good sleep and kind self-talk through exam season.': 'परीक्षा के मौसम में स्थिर ध्यान, अच्छी नींद और खुद से प्यारी बातें।',
    'Steady square before each study round': 'हर पढ़ाई के दौर से पहले Steady square', 'Exam calm, a 14 day programme': 'परीक्षा में शांति, 14 दिन का प्रोग्राम',
    'Appraisal season': 'अप्रेज़ल का मौसम', 'For the weeks of reviews, targets and tough conversations at work.': 'काम पर समीक्षा, लक्ष्य और मुश्किल बातचीत वाले हफ़्तों के लिए।',
    'Desk reset between meetings': 'मीटिंग के बीच Desk reset', 'Boundaries that protect your energy': 'सीमाएँ जो आपकी ऊर्जा बचाती हैं', 'Recovering from burnout': 'थकान से उबरना',
    'Monsoon low days': 'मानसून के उदास दिन', 'Grey skies and indoor days: small lifts for a heavier mood.': 'धूसर आसमान और घर के अंदर के दिन: भारी मूड के लिए छोटी राहतें।',
    'Festival season with family': 'परिवार के साथ त्योहारों का मौसम', 'Joy, crowds, travel and family time: stay steady and kind to yourself.': 'खुशी, भीड़, सफ़र और परिवार का समय: स्थिर रहें और खुद के प्रति दयालु रहें।',
    'Cool down after a disagreement': 'अनबन के बाद Cool down', 'Warm wishes for family': 'परिवार के लिए Warm wishes', 'Sigh of relief in a crowd': 'भीड़ में Sigh of relief',
    'Calm game': 'शांत खेल', 'Trace the square': 'Trace the square', 'Follow the dot': 'बिंदु के साथ चलें', 'Follow the dot round the square as you breathe.': 'साँस लेते हुए वर्ग के चारों ओर बिंदु के साथ चलें।',
    'Keep your finger on the glowing dot as it travels round the square. Breathe in up the side, hold across the top, out down the side, rest along the bottom.': 'चमकते बिंदु पर उँगली रखें जब वह वर्ग के चारों ओर घूमे। ऊपर जाते समय साँस लें, ऊपर रोकें, नीचे आते समय छोड़ें, नीचे आराम करें।',
    'Start': 'शुरू करें', 'Restart': 'फिर से शुरू करें', 'Place your finger on the dot, then tap Start.': 'बिंदु पर उँगली रखें, फिर शुरू करें दबाएँ।', 'Three calm squares done.': 'तीन शांत वर्ग पूरे।',
    'Body scan, yoga nidra, stories': 'बॉडी स्कैन, योग निद्रा, कहानियाँ', 'Private, on this phone': 'निजी, इसी फ़ोन पर', 'What to say and do': 'क्या कहें और करें', 'Exams, festivals, monsoon': 'परीक्षा, त्योहार, मानसून',
    'Breathing vibration: on': 'साँस का कंपन: चालू', 'Breathing vibration: off': 'साँस का कंपन: बंद', 'Saved on this phone.': 'इस फ़ोन पर सेव हो गया।'
  });
  var tr = window.LoosenUpI18n;
  if (tr && tr.patterns) tr.patterns.push(
    [/^(Body scan|Yoga nidra|Sleep story) · (\d+) min$/, function (m) { return tr.tr(m[1]) + ' · ' + m[2] + ' मिनट'; }],
    [/^(\d+):(\d+) left$/, function (m) { return m[1] + ':' + m[2] + ' बाकी'; }],
    [/^Sound keeps playing for (\d+) min, then fades\.$/, function (m) { return 'आवाज़ ' + m[1] + ' मिनट चलती रहेगी, फिर धीरे से बंद होगी।'; }],
    [/^A notification will arrive each day at ([\d:]+)\.$/, function (m) { return 'हर दिन ' + m[1] + ' बजे एक नोटिफ़िकेशन आएगा।'; }],
    [/^Goal met: (\d+) of (\d+) days this week\. Lovely\.$/, function (m) { return 'लक्ष्य पूरा: इस हफ़्ते ' + m[2] + ' में से ' + m[1] + ' दिन। बहुत बढ़िया।'; }],
    [/^(\d+) of (\d+) days this week\.$/, function (m) { return 'इस हफ़्ते ' + m[2] + ' में से ' + m[1] + ' दिन।'; }],
    [/^(\d+) of (\d+) days with a calm break\.$/, function (m) { return m[2] + ' में से ' + m[1] + ' दिन शांत ब्रेक के साथ।'; }],
    [/^What helped most: (.+)\.$/, function (m) { return 'सबसे ज़्यादा मदद: ' + m[1] + '।'; }],
    [/^Came up most: (.+)\.$/, function (m) { return 'सबसे ज़्यादा आया: ' + tr.tr(m[1]) + '।'; }],
    [/^You stayed with the dot (\d+)% of the time\. Every breath counted\.$/, function (m) { return 'आप ' + m[1] + '% समय बिंदु के साथ रहे। हर साँस मायने रखती थी।'; }]
  );

  buildSleep(); buildPush(); buildLength(); buildGoal(); buildComfort(); buildJournal(); buildFriend(); buildPacks(); buildTrace(); buildTraceTiles(); buildTiles(); buildSeasonCard();
  core.register('progress-extra', renderGoal);
  core.onRender('progress', renderGoal);
  core.onRender('play', renderLength);
  document.addEventListener('click', onClick);
  window.addEventListener('lu:phase', onPhase);
  if (core.current() && core.current() !== 'welcome') core.go(core.current());

  window.LoosenUpMore = {
    sleepStart: sleepStart, sleepTick: sleepTick, sleepStop: sleepStop, sleepRun: function () { return sleepRun && { id: sleepRun.s.id, i: sleepRun.i, elapsed: sleepRun.elapsed, total: sleepRun.total, done: !!sleepRun.done }; },
    subscribePush: subscribePush, pushSupported: pushSupported, setLength: setLength, setGoal: setGoal, inSeason: inSeason, packs: PACKS,
    saveJournal: saveJournal, traceStart: traceStart, traceEnd: function () { return trace ? traceEnd() : null; }, dotAt: dotAt, onPhase: onPhase, vibrate: vibrate
  };
})();
