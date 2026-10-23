import { makeApp, onboard, day } from './helpers/app.mjs';
const app = makeApp({ now: day(1) }); onboard(app); const B = app.B;
for (const id of ['sigh', 'breeze', 'here']) { B.go('today'); const r = B.startNow(id); console.log(id, r, B.currentScreen()); app.click('#session-finish'); console.log(' after finish', B.currentScreen()); }
B.go('today');
console.log('sleep', JSON.stringify(app.window.LoosenUpMore.sleepStart('scan')), app.$('#sp-kind').textContent, JSON.stringify(app.window.LoosenUpMore.sleepRun()));
