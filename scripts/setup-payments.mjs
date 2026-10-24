// Creates the LoosenUp Plus plans in Razorpay (India, INR) and Paddle (everywhere else, USD), once per account.
// Reads keys from the environment and prints only the plan and price ids, which are not secret:
//
//   RAZORPAY_KEY_ID=... RAZORPAY_KEY_SECRET=... PADDLE_API_KEY=... PADDLE_ENV=sandbox node scripts/setup-payments.mjs
//
// Then add the printed ids to Vercel as RAZORPAY_PLAN_MONTHLY, RAZORPAY_PLAN_YEARLY, PADDLE_PRICE_MONTHLY and PADDLE_PRICE_YEARLY.
const env = process.env;
const out = {};

if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  const auth = 'Basic ' + Buffer.from(env.RAZORPAY_KEY_ID + ':' + env.RAZORPAY_KEY_SECRET).toString('base64');
  const plan = async (period, amount, name) => {
    const r = await fetch('https://api.razorpay.com/v1/plans', {
      method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ period, interval: 1, item: { name, amount, currency: 'INR', description: 'Every programme, every sleep session and every seasonal pack.' } })
    });
    const j = await r.json();
    if (!r.ok) throw new Error('Razorpay: ' + JSON.stringify(j.error || j));
    return j.id;
  };
  out.RAZORPAY_PLAN_MONTHLY = await plan('monthly', 14900, 'LoosenUp Plus, monthly');
  out.RAZORPAY_PLAN_YEARLY = await plan('yearly', 79900, 'LoosenUp Plus, yearly');
}

if (env.PADDLE_API_KEY) {
  const base = env.PADDLE_ENV === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com';
  const call = async (path, body) => {
    const r = await fetch(base + path, { method: 'POST', headers: { Authorization: 'Bearer ' + env.PADDLE_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) throw new Error('Paddle: ' + JSON.stringify(j.error || j));
    return j.data;
  };
  const product = await call('/products', { name: 'LoosenUp Plus', tax_category: 'standard', description: 'Every programme, every sleep session and every seasonal pack.' });
  const price = (interval, amount, description) => call('/prices', {
    product_id: product.id, description, billing_cycle: { interval, frequency: 1 }, unit_price: { amount: String(amount), currency_code: 'USD' }
  });
  out.PADDLE_PRICE_MONTHLY = (await price('month', 499, 'Monthly')).id;
  out.PADDLE_PRICE_YEARLY = (await price('year', 3499, 'Yearly')).id;
}

if (!Object.keys(out).length) console.log('Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, and or PADDLE_API_KEY, then run again.');
for (const [k, v] of Object.entries(out)) console.log(k + '=' + v);
