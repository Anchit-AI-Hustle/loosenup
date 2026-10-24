/* Same theme as the app on every LoosenUp page: Auto (follows the phone), Light or Dark,
   saved by the app as loosenup.theme. Loaded in <head> so the page never flashes the wrong colours. */
(function () {
  'use strict';
  var t = 'auto';
  try { t = window.localStorage.getItem('loosenup.theme') || 'auto'; } catch (e) { /* private mode */ }
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function apply() {
    var dark = t === 'dark' || (t === 'auto' && mq && mq.matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#0E1626' : '#EDF7FF');
  }
  apply();
  if (mq && t === 'auto') { try { mq.addEventListener('change', apply); } catch (e) { /* older browsers */ } }
})();
