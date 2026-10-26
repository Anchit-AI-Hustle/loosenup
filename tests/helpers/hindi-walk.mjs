// Drives LoosenUp through every screen, tool, lesson and game, collecting visible text.
import { makeApp, onboard, day } from './app.mjs';

// English that stays English in Hindi mode: brand words, names, numbers, phone menu labels.
export const KEEP_EN = [
  'LoosenUp', 'Full Bloom', 'Calm gain', 'Sunny days', 'Sunny day', 'Sunny week', 'Rain day', 'Golden hour', 'Sunbeams', 'Sunbeam',
  'Seedling', 'Sprout', 'Meadow', 'Bloom', 'Bud', 'Seeds', 'Seed', 'XP', 'SOS', 'PIN', 'Tele-MANAS', 'WhatsApp', 'Face ID',
  'Breath Bloom', 'Petal Pairs', 'Trace the square', 'Plus', 'UPI', 'LU...', 'Sunbeam Catch', 'Calm Pairs', 'Breathing Ring', 'LoosenUp Plus', 'Sigh of relief', 'Slow breeze', 'Here and now', 'Soft release', 'Let it out',
  'Kind words', 'Desk reset', 'Steady square', 'Pause before replying', 'Cool down', 'Warm wishes', 'Quick breeze',
  'Gentle wave', 'Name it', 'Park the worry', 'Tomorrow list', 'Shake it out', 'Kind friend voice', 'Reach out', 'Gentle lift', 'Savour it', 'Hope and a first step', 'Bubble Pop', 'Colour Sort', 'Zen Sand', 'Star Connect', 'Gentle Stack', 'Kind Notes',
  'findahelpline.com', 'Vandrevala Foundation', 'iCall (TISS)', 'iCall', 'Stanley-Brown', 'WHO-5', 'RCI', 'NMC', 'MBBS', 'MD', 'CBT', 'OPD',
  'USD', 'Android', 'iPhone', 'Safari', 'Chrome', 'Share', 'Add to Home Screen', 'Install app', 'loosenup.anchit-tandon.com',
  'English', 'Asha', 'Rao', 'Dr', 'Meera', 'Seed shop', 'x7', 'LUAB12CD', 'Amaha', 'Mpower', 'BMC', 'NCR', 'AI', 'WhatsApp', 'NGO', 'OPD', 'Anchit'
];

export function leftovers(text) {
  let t = ' ' + text + ' ';
  for (const k of [...KEEP_EN].sort((a, b) => b.length - a.length)) t = t.split(k).join(' ');
  return /[A-Za-z]{2,}/.test(t) ? text : null;
}

export async function walkAll({ lang = 'hi' } = {}) {
  const app = makeApp({ now: day(1), rng: () => 0.01 });
  const { B, document } = app;
  const seen = new Map();
  const flush = () => new Promise((r) => setTimeout(r, 0));
  const grabNow = () => {
    const w = document.createTreeWalker(document.body, 4);
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentElement;
      if (!p || p.closest('script,style,svg,[data-no-tr],textarea')) continue;
      const t = n.nodeValue.replace(/\s+/g, ' ').trim();
      if (t) seen.set(t, (p.closest('[data-screen]') || p.closest('.sheet') || p).id || p.tagName);
    }
    document.querySelectorAll('[placeholder],[aria-label],[title]').forEach((e) => {
      if (e.closest('[data-no-tr]')) return;
      for (const a of ['placeholder', 'aria-label', 'title']) { const v = e.getAttribute(a); if (v) seen.set(v.trim(), '@' + a); }
    });
  };
  const grab = async () => { await flush(); grabNow(); };
  if (lang === 'hi') B.setLang('hi');
  await grab();
  onboard(app); await grab();
  for (const sp of ['everyday', 'work', 'relationships', 'lowdays', 'sleep']) { app.click(`[data-space-tab="${sp}"]`); await grab(); }
  app.click('[data-context="Busy mind"]'); app.click('[data-context="Tight shoulders"]'); app.click('#checkin-next'); await grab();
  app.click('#pick-begin'); await grab(); app.click('#session-finish'); await grab(); app.click('#after-next'); await grab();
  for (const s of ['today', 'play', 'progress', 'me', 'support', 'safety', 'reframe', 'sounds', 'wellbeing', 'learn']) { B.go(s); await grab(); }
  for (const sg of ['breathe', 'games', 'sounds']) { B.go('play'); app.click(`[data-seg="${sg}"]`); await grab(); }
  for (const id of Object.keys(B.programs)) { B.openProgram(id); await grab(); }
  B.go('programs'); await grab();
  for (const id of Object.keys(B.programs)) { B.openProgram(id); B.startProgramDay(); await grab(); }
  B.setState({ plan: 'fullbloom' }); B.openProgram('sleep'); await grab(); B.setState({ plan: 'free' });
  B.go('support'); B.useLocation({ lat: 28.6, lon: 77.2 }); await grab();
  for (const c of ['Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi']) { B.setCity(c); await grab(); }
  for (const l of B.lessons) { B.openLesson(l.id); await grab(); }
  for (const g of ['pairs', 'catch', 'bloom', 'pop', 'sort', 'sand', 'stars', 'stack', 'kind']) { B.openGame(g); await grab(); B.finishCurrentGame(); await grab(); }
  for (let m = 1; m <= 5; m++) { B.go('today'); app.click(`[data-mood="${m}"]`); await grab(); }
  B.go('today'); app.click('#sos-btn'); await grab();
  app.click('#support-close');
  B.go('today'); app.click('#breathe-now'); await grab(); app.click('#session-audio'); await grab();
  app.click('#session-finish'); await grab(); app.click('#after-next'); await grab(); app.click('#result-done');
  B.setState({ trusted: { name: 'Meera', phone: '+919876543210' } }); B.go('me'); await grab(); app.click('#trusted-edit'); await grab();
  B.go('today'); app.click('#sos-btn'); app.$('#sos-more').open = true; await grab();
  for (const sh of ['shop-sheet', 'checkout-sheet', 'jar-sheet', 'confirm-sheet', 'safety-sheet']) { const el = document.getElementById(sh); if (el) { el.hidden = false; B.translateDom(el); await grab(); el.hidden = true; } }
  return { app, seen };
}
