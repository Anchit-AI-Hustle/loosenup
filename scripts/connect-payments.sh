#!/usr/bin/env bash
# Connects LoosenUp Plus to Razorpay (India) and Paddle (everywhere else) in SANDBOX mode.
# Run it yourself in a terminal from the repo:   bash scripts/connect-payments.sh
#
# Keys are typed here (hidden as you type) and go straight into Vercel's encrypted settings.
# They are never printed, written to disk or committed. Press Enter to skip a provider.
set -euo pipefail
cd "$(dirname "$0")/.."

SITE="https://loosenup.anchit-tandon.com"
# Hidden input makes a double paste easy to miss, so a value made of two identical halves is kept once.
ask() {
  local v h; read -r -s -p "$1: " v; echo >&2
  v="$(printf %s "$v" | tr -d '[:space:]')"
  h=$(( ${#v} / 2 ))
  if [ $(( ${#v} % 2 )) -eq 0 ] && [ "$h" -gt 0 ] && [ "${v:0:$h}" = "${v:$h}" ]; then echo "  (pasted twice; using it once)" >&2; v="${v:0:$h}"; fi
  printf %s "$v"
}
setenv() {
  npx --yes vercel env rm "$1" production -y >/dev/null 2>&1 || true
  printf %s "$2" | npx --yes vercel env add "$1" production >/dev/null
  echo "  saved $1 in Vercel"
}

echo
echo "== Razorpay (India: UPI, UPI Autopay, cards) =="
echo "Dashboard in Test Mode -> Account & Settings -> API Keys -> Generate Test Key."
RZP_ID=$(ask "Razorpay Key Id (rzp_test_...)")
if [ -n "$RZP_ID" ]; then
  case "$RZP_ID" in rzp_test_*) ;; *) echo "That is not a test key (rzp_test_...). Stopping so nothing live is touched."; exit 1;; esac
  RZP_SECRET=$(ask "Razorpay Key Secret")
  RZP_HOOK=$(openssl rand -hex 24)
fi

echo
echo "== Paddle (everywhere else; handles sales tax and VAT) =="
echo "Sandbox dashboard -> Developer tools -> Authentication."
PDL_KEY=$(ask "Paddle sandbox API key (needs product, price, subscription and notification permissions)")
if [ -n "$PDL_KEY" ]; then PDL_TOKEN=$(ask "Paddle sandbox client-side token (test_...)"); fi

if [ -z "$RZP_ID" ] && [ -z "$PDL_KEY" ]; then echo "Nothing to connect."; exit 0; fi

echo
echo "Creating the monthly and yearly plans..."
IDS=$(RAZORPAY_KEY_ID="${RZP_ID:-}" RAZORPAY_KEY_SECRET="${RZP_SECRET:-}" PADDLE_API_KEY="${PDL_KEY:-}" PADDLE_ENV=sandbox node scripts/setup-payments.mjs)
get() { printf '%s\n' "$IDS" | sed -n "s/^$1=//p"; }

if [ -n "$PDL_KEY" ]; then
  echo "Creating the Paddle webhook..."
  PDL_HOOK=$(PADDLE_API_KEY="$PDL_KEY" SITE="$SITE" node -e '
    fetch("https://sandbox-api.paddle.com/notification-settings", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.PADDLE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ description: "LoosenUp Plus", type: "url", destination: process.env.SITE + "/api/plus?hook=paddle", api_version: 1,
        include_sensitive_fields: false, subscribed_events: ["subscription.created", "subscription.activated", "subscription.updated",
          "subscription.canceled", "subscription.past_due", "subscription.paused", "subscription.resumed", "subscription.trialing"] })
    }).then(r => r.json()).then(j => { if (!j.data) throw new Error(JSON.stringify(j.error || j)); process.stdout.write(j.data.endpoint_secret_key); })
      .catch(e => { console.error("Paddle webhook: " + e.message); process.exit(1); });')
fi

echo
echo "Saving to Vercel (production)..."
if [ -n "$RZP_ID" ]; then
  setenv RAZORPAY_KEY_ID "$RZP_ID"
  setenv RAZORPAY_KEY_SECRET "$RZP_SECRET"
  setenv RAZORPAY_WEBHOOK_SECRET "$RZP_HOOK"
  setenv RAZORPAY_PLAN_MONTHLY "$(get RAZORPAY_PLAN_MONTHLY)"
  setenv RAZORPAY_PLAN_YEARLY "$(get RAZORPAY_PLAN_YEARLY)"
fi
if [ -n "$PDL_KEY" ]; then
  setenv PADDLE_API_KEY "$PDL_KEY"
  setenv PADDLE_CLIENT_TOKEN "$PDL_TOKEN"
  setenv PADDLE_WEBHOOK_SECRET "$PDL_HOOK"
  setenv PADDLE_PRICE_MONTHLY "$(get PADDLE_PRICE_MONTHLY)"
  setenv PADDLE_PRICE_YEARLY "$(get PADDLE_PRICE_YEARLY)"
  setenv PADDLE_ENV sandbox
fi

echo
echo "Done. One manual step is left:"
if [ -n "$RZP_ID" ]; then
  echo
  echo "Razorpay (Test Mode) -> Account & Settings -> Webhooks -> Add New Webhook:"
  echo "  URL:    $SITE/api/plus?hook=razorpay"
  echo "  Secret: $RZP_HOOK"
  echo "  Events: subscription.activated, subscription.charged, subscription.pending,"
  echo "          subscription.halted, subscription.cancelled, subscription.completed"
  echo "  (This secret is shown only here. It is already saved in Vercel.)"
fi
if [ -n "$PDL_KEY" ]; then
  echo
  echo "Paddle sandbox -> Checkout -> Checkout settings -> Default payment link:"
  echo "  $SITE/plus.html"
fi
echo
echo "Then tell Claude 'payments connected' to redeploy and run a sandbox purchase test."
