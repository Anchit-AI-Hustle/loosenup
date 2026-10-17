// Loads www/index.html + www/app.js into jsdom and exposes the LoosenUp test API.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { after } from 'node:test';

// Close every jsdom window when the test file ends so session timers do not keep node alive.
const open = [];
after(() => open.forEach((d) => d.window.close()));

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const WWW = path.join(ROOT, 'www');
export const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');

const html = () => read('www/index.html').replace(/<script\b[^>]*src=[^>]*><\/script>/g, '');
const appJs = () => read('www/app.js');

// Fixed local clock helper: day(1) = 2026-10-05 (a Monday) at 09:00 local.
export function day(n, hour = 9) {
  return new Date(2026, 9, 4 + n, hour, 0, 0);
}

export function makeApp({ state, now, rng, ua } = {}) {
  const dom = new JSDOM(html(), {
    url: 'https://loosenup.test/',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  open.push(dom);
  const { window } = dom;
  const errors = [];
  window.console.error = (...a) => errors.push(a.join(' '));
  window.addEventListener('error', (e) => errors.push(String(e.message)));
  if (ua) Object.defineProperty(window.navigator, 'userAgent', { value: ua, configurable: true });
  if (state) window.localStorage.setItem('loosenup.v1', JSON.stringify(state));
  window.__LOOSENUP_TEST__ = { now: now || null, rng: rng || null };
  window.eval(appJs());
  const B = window.LoosenUp;
  if (!B) throw new Error('window.LoosenUp API missing');
  const $ = (sel) => window.document.querySelector(sel);
  const click = (sel) => {
    const el = typeof sel === 'string' ? $(sel) : sel;
    if (!el) throw new Error('No element for ' + sel);
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  };
  const setValue = (sel, value) => {
    const el = $(sel);
    if (!el) throw new Error('No element for ' + sel);
    el.value = String(value);
    el.dispatchEvent(new window.Event('input', { bubbles: true }));
    el.dispatchEvent(new window.Event('change', { bubbles: true }));
  };
  const visible = (sel) => {
    const el = $(sel);
    return !!el && !el.hidden && !el.closest('[hidden]');
  };
  return { dom, window, document: window.document, B, $, click, setValue, visible, errors };
}

// Walks the LoosenUp onboarding: welcome -> gift -> first check-in.
export function onboard(app, name = 'Asha') {
  app.setValue('#name-input', name);
  app.click('#welcome-go');
  app.click('#gift-go');
}

// Runs one guided break through the DOM from the check-in screen.
export function runBreak(app, { before, after, context = 'Hard to focus', technique } = {}) {
  app.setValue('#calm-before', before);
  app.click(`[data-context="${context}"]`);
  app.click('#checkin-next');
  if (technique) app.click(`[data-pick="${technique}"]`);
  app.click('#pick-begin');
  app.click('#session-finish');
  app.setValue('#calm-after', after);
  app.click('#after-next');
}
