// ProofRoom web client — renders an order summary from the QuickCart API.
// This client depends on the checkout response contract:
//   { orderId, total, discountApplied }
// See test/contract.test.js for the pinned expectations.

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

async function placeOrder(cart, options = {}) {
  const res = await fetch(API_BASE + '/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, discountCode: options.discountCode, region: options.region || 'US' }),
  });
  if (!res.ok) throw new Error('checkout failed: ' + res.status);
  return res.json();
}

// The order-summary card in the UI: reads exactly these contract fields.
function renderSummary(order) {
  const badge = order.discountApplied ? ` (code ${order.discountApplied})` : '';
  return `Order ${order.orderId} — charged $${order.total}${badge}`;
}

module.exports = { placeOrder, renderSummary, API_BASE };
