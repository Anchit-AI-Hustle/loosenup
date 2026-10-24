/* LoosenUp Plus checkout page. The app makes a Plus key first and opens this page with it in the
   address fragment (#k=...&plan=...), which never reaches any server log. Razorpay serves India
   and Paddle serves everywhere else; the server decides which, from the visitor's country. */
(function () {
  'use strict';
  var API = '/api/plus';
  var $ = function (id) { return document.getElementById(id); };
  var hash = {};
  location.hash.replace(/^#/, '').split('&').forEach(function (p) { var kv = p.split('='); if (kv[0]) hash[kv[0]] = decodeURIComponent(kv[1] || ''); });
  // Back from Razorpay's redirect mode (#paid or #unpaid): the key waited in this tab's session.
  var back = 'paid' in hash ? 'paid' : 'unpaid' in hash ? 'unpaid' : null;
  if (back) { try { hash.k = sessionStorage.getItem('lu.plusKey') || ''; hash.lang = sessionStorage.getItem('lu.plusLang') || ''; } catch (e) { /* private mode */ } }
  var key = hash.k || null;
  var plan = hash.plan === 'monthly' ? 'monthly' : 'yearly';
  var I = window.LoosenUpI18n;
  var hindi = hash.lang === 'hi';
  var renews = true;

  function tr(s) { return hindi && I ? I.tr(s) : s; }
  function text(id, s) { $(id).textContent = tr(s); }
  function translatePage() {
    if (!hindi || !I) return;
    document.documentElement.lang = 'hi';
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (n.parentElement.closest('[data-no-tr],script,style')) continue;
      var t = n.nodeValue.trim();
      if (t) { var h = I.tr(t); if (h !== t) n.nodeValue = n.nodeValue.replace(t, h); }
    }
  }
  function show(which) { ['plus-offer', 'plus-wait', 'plus-done'].forEach(function (id) { $(id).hidden = id !== which; }); }
  function stop(msg) {
    text('plus-error', msg);
    if (!$('plus-wait').hidden) { text('plus-wait-title', 'Checkout did not finish'); text('plus-wait-text', 'Nothing was charged unless you saw a payment confirmation.'); $('plus-retry').hidden = false; }
  }
  // #country=US tries another region's checkout; the server honours it only while payments are in test mode.
  var country = /^[A-Za-z]{2}$/.test(hash.country || '') ? hash.country.toUpperCase() : '';
  if (back) { try { country = sessionStorage.getItem('lu.plusCountry') || ''; } catch (e) { /* private mode */ } }
  function call(action, body) {
    if (body && country) body.country = country;
    return fetch(API + (body ? '' : '?action=' + action + (country ? '&country=' + country : '')), body
      ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ action: action }, body)) }
      : {}).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Please try again.'); return j; }); });
  }
  function load(src) {
    return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { no(new Error('The payment page could not load. Check your connection and try again.')); }; document.head.appendChild(s); });
  }
  function selectPlan(p) {
    plan = p;
    var b = document.querySelectorAll('[data-plan]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', String(b[i].getAttribute('data-plan') === p));
  }

  function done(st) {
    show('plus-done');
    $('plus-key').textContent = key;
    var date = st && st.until ? new Date(st.until).toLocaleDateString(hindi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
    if (date) text('plus-until', 'Active until ' + date + (st.cancelAtEnd && !renews ? '. Buy again any time to add more.' : '. It renews automatically unless you cancel.'));
    try { history.replaceState(null, '', location.pathname + '#done'); } catch (e) { /* older browsers */ }
  }
  // After Paddle's checkout, the webhook turns Plus on; check until it has.
  function waitForActive(tries) {
    return call('status', { key: key }).then(function (st) {
      if (st.active) return done(st);
      if (tries <= 0) throw new Error('Your payment is being confirmed. Plus turns on within a few minutes, in the app too.');
      return new Promise(function (r) { setTimeout(r, 2000); }).then(function () { return waitForActive(tries - 1); });
    });
  }

  function razorpay(c) {
    return load('https://checkout.razorpay.com/v1/checkout.js').then(function () {
      // One payment (Standard Checkout order) or a subscription, whichever the server set up.
      var opts = {
        key: c.keyId, name: 'LoosenUp Plus',
        description: c.orderId ? (c.plan === 'yearly' ? 'One year of Plus' : 'One month of Plus') : (c.plan === 'yearly' ? 'Yearly plan' : 'Monthly plan'),
        theme: { color: '#276E4F' },
        handler: function (r) {
          text('plus-wait-title', 'Confirming your payment...');
          var proof = { key: key, razorpay_payment_id: r.razorpay_payment_id, razorpay_signature: r.razorpay_signature };
          if (c.orderId) proof.razorpay_order_id = r.razorpay_order_id; else proof.razorpay_subscription_id = r.razorpay_subscription_id;
          call('verify', proof).then(done).catch(function (e) { stop(e.message); });
        },
        modal: { ondismiss: function () { stop('Checkout was closed before paying. Nothing was charged.'); } }
      };
      if (c.orderId) {
        opts.order_id = c.orderId; opts.amount = c.amount; opts.currency = c.currency;
        // Bank checks go through the page itself, not a popup that phones and in-app browsers block.
        opts.redirect = true;
        opts.callback_url = location.origin + '/api/plus?action=callback';
        try { sessionStorage.setItem('lu.plusKey', key); sessionStorage.setItem('lu.plusLang', hindi ? 'hi' : ''); sessionStorage.setItem('lu.plusCountry', country); } catch (e) { /* private mode */ }
      } else opts.subscription_id = c.subscriptionId;
      var rzp = new window.Razorpay(opts);
      rzp.on && rzp.on('payment.failed', function () { stop('That payment did not go through. Nothing was charged. Try again or use another method.'); });
      rzp.open();
    });
  }
  function paddle(c) {
    return load('https://cdn.paddle.com/paddle/v2/paddle.js').then(function () {
      var P = window.Paddle;
      if (c.env === 'sandbox') P.Environment.set('sandbox');
      P.Initialize({ token: c.token, eventCallback: function (e) {
        if (e.name === 'checkout.completed') { show('plus-wait'); text('plus-wait-title', 'Confirming your payment...'); waitForActive(30).catch(function (x) { stop(x.message); }); }
        if (e.name === 'checkout.closed' && $('plus-done').hidden) stop('Checkout was closed before paying. Nothing was charged.');
        if (e.name === 'checkout.error') stop('The payment page could not open. Nothing was charged. Please try again in a moment.');
      } });
      var settings = { displayMode: 'overlay', theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light' };
      P.Checkout.open(c.transactionId ? { transactionId: c.transactionId, settings: settings }
        : { items: [{ priceId: c.priceId, quantity: 1 }], customData: c.customData, settings: settings });
    });
  }

  function checkout() {
    show('plus-wait');
    text('plus-error', '');
    $('plus-retry').hidden = true;
    text('plus-wait-title', 'Opening secure checkout...');
    var made = key ? Promise.resolve() : call('start', { plan: plan }).then(function (s) { key = s.key; });
    return made.then(function () { return call('checkout', { key: key }); }).then(function (c) {
      if (c.alreadyActive) return waitForActive(0);
      return c.provider === 'razorpay' ? razorpay(c) : paddle(c);
    }).catch(function (e) { stop(e.message); });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-plan')) selectPlan(b.getAttribute('data-plan'));
    else if (b.id === 'plus-buy' || b.id === 'plus-retry') checkout();
    else if (b.id === 'plus-copy' && navigator.clipboard) navigator.clipboard.writeText(key).then(function () { text('plus-copy', 'Copied'); });
  });

  translatePage();
  selectPlan(plan);
  call('config').then(function (c) {
    if (c.prices) { $('price-monthly').textContent = c.prices.monthly; $('price-yearly').textContent = c.prices.yearly; }
    renews = c.renews !== false;
    if (c.enabled && !renews) text('plus-pay-note', 'One payment for a month or a year of Plus. It does not renew; buy again any time.');
    if (!c.enabled) { $('plus-buy').disabled = true; text('plus-pay-note', 'LoosenUp Plus opens soon. Until then, everything in LoosenUp is free.'); return; }
    if (back === 'paid' && key) { show('plus-wait'); text('plus-wait-title', 'Confirming your payment...'); waitForActive(10).catch(function (x) { stop(x.message); }); }
    else if (back === 'unpaid' && key) { show('plus-wait'); stop('That payment did not go through. Nothing was charged. Try again or use another method.'); $('plus-retry').hidden = false; }
    else if (key) checkout();
  }).catch(function () { text('plus-error', 'Connect to the internet to continue.'); });

  window.LoosenUpPlusPage = { checkout: checkout, key: function () { return key; } };
})();
