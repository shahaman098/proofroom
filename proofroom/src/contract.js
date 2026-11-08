// Contract checks the real clients run against the QuickCart checkout response.
// Kept in sync with ../../clients/mobile-client-v1.js and web-client.js (see contract.test.js).
export const V1_CONTRACT_FIELDS = ['orderId', 'total', 'discountApplied'];
export const V2_FIELDS = ['grandTotal', 'taxBreakdown'];

// Old mobile app v1.2: crashes if any field it parses is missing from the response.
export function checkV1(order) {
  const missing = V1_CONTRACT_FIELDS.filter(field => !(field in order));
  return {ok: missing.length === 0, missing};
}

// Web client order-summary card: reads `total`.
export function renderSummary(order) {
  const badge = order.discountApplied ? ` (code ${order.discountApplied})` : '';
  return `Order ${order.orderId} — charged $${order.total}${badge}`;
}

export function checkV2(order) {
  const missing = V2_FIELDS.filter(field => !(field in order));
  return {ok: missing.length === 0, missing};
}

// Local replay of PR #5 (fd023c7): the same real response, minus the old `total` field.
export function replayPr5(order) {
  const {total, ...rest} = order;
  return rest;
}

export const API_BASE = import.meta.env?.VITE_API_BASE ?? '';

export async function getProducts(base = API_BASE) {
  const res = await fetch(`${base}/api/products`);
  if (!res.ok) throw new Error(`products request failed (${res.status})`);
  return res.json();
}

export async function checkout(body, base = API_BASE) {
  const res = await fetch(`${base}/api/checkout`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
  const json = await res.json().catch(() => ({}));
  return {status: res.status, ok: res.ok, version: res.headers.get('X-API-Version'), body: json};
}
