/* LoosenUp helplines: the one place every crisis and support number lives.
   The SOS sheet, Find support and the safety plan read from here, and a unit test
   (tests/unit/at36-helplines.test.mjs) checks that index.html, install.html,
   partners.js and README.md show the same numbers. Checked on official sites on 2026-10-18. */
(function (root) {
  'use strict';
  var HELPLINES = {
    checked: '2026-10-18',
    telemanas: {
      name: 'Tele-MANAS', number: '14416', display: '14416', tel: 'tel:14416', tollFree: '1-800-891-4416',
      hours: '24x7', note: '24x7, free, in 20 languages, including Hindi and English.', url: 'https://telemanas.mohfw.gov.in/'
    },
    vandrevala: {
      name: 'Vandrevala Foundation', number: '+919999666555', display: '+91 9999 666 555', tel: 'tel:+919999666555',
      whatsapp: 'https://wa.me/919999666555', hours: '24x7', note: '24x7, free, call or WhatsApp.'
    },
    icall: {
      name: 'iCall', number: '9152987821', display: '9152987821', tel: 'tel:9152987821', email: 'icall@tiss.edu',
      hours: 'Mon to Sat, 8am to 9pm', note: 'Mon to Sat, 8am to 9pm, free.'
    },
    emergency: { name: 'Emergency', number: '112', display: '112', tel: 'tel:112' },
    elsewhere: 'https://findahelpline.com'
  };
  // Lines for the safety plan's "Professionals and helplines" step.
  HELPLINES.safetyPlanText = [
    'Tele-MANAS ' + HELPLINES.telemanas.display + ' (24x7, free)',
    'Vandrevala Foundation ' + HELPLINES.vandrevala.display + ' (24x7, call or WhatsApp)',
    'iCall ' + HELPLINES.icall.display + ' (' + HELPLINES.icall.hours + ')',
    'Emergency ' + HELPLINES.emergency.display
  ].join('\n');
  root.LoosenUpHelplines = HELPLINES;
  if (typeof module === 'object' && module.exports) module.exports = HELPLINES;
})(typeof window !== 'undefined' ? window : globalThis);
