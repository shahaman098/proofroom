// Legacy mobile client, API version pinned at v1.2 (shipped to the App Store).
// React Native clients in the wild read the SAME contract fields the web
// client uses. These binaries cannot be updated on demand — the backend MUST
// keep serving them. This fixture represents every deployed mobile client.

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

// Fields the shipped binary parses out of the checkout response. Remove or
// rename any of these server-side and every deployed mobile client breaks.
const V1_CONTRACT_FIELDS = ['orderId', 'total', 'discountApplied'];

function assertV1Contract(orderResponse) {
  const missing = V1_CONTRACT_FIELDS.filter((f) => !(f in orderResponse));
  if (missing.length) {
    const err = new Error('V1 contract violation — mobile clients will crash. Missing: ' + missing.join(', '));
    err.code = 'V1_CONTRACT_VIOLATION';
    err.missing = missing;
    throw err;
  }
  return true;
}

// Simulates the legacy binary's checkout call (it also parses `error` on 400s).
async function mobileCheckout(cart, options = {}) {
  const res = await fetch(API_BASE + '/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, discountCode: options.discountCode, region: options.region || 'US' }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'mobile checkout failed');
  assertV1Contract(body);
  return body;
}

module.exports = { V1_CONTRACT_FIELDS, assertV1Contract, mobileCheckout };
