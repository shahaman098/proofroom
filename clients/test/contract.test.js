// Contract tests: proofroom-web against the QuickCart API.
// These are the tests that catch cross-repo breakage. Run with API_BASE
// pointing at the backend under test.

const { placeOrder, renderSummary } = require('../web-client');
const { mobileCheckout, V1_CONTRACT_FIELDS } = require('../mobile-client-v1');

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const CART = [{ id: 'mouse', qty: 2 }];

describe('web client contract', () => {
  test('checkout returns the fields the UI renders', async () => {
    const order = await placeOrder(CART, { discountCode: 'SAVE10' });
    expect(typeof order.orderId).toBe('string');
    expect(typeof order.total).toBe('number');
    expect(order.discountApplied).toBe('SAVE10');
  });

  test('order summary renders a dollar amount', async () => {
    const order = await placeOrder(CART);
    expect(renderSummary(order)).toMatch(/\$\d/);
  });
});

describe('legacy mobile clients (v1.2, pinned in production)', () => {
  test('every pinned contract field is present in the response', async () => {
    const order = await mobileCheckout(CART);
    for (const f of V1_CONTRACT_FIELDS) expect(f in order).toBe(true);
  });

  test('mobile checkout still charges a number', async () => {
    const order = await mobileCheckout(CART, { discountCode: 'WELCOME5' });
    expect(typeof order.total).toBe('number');
    expect(order.total).toBeGreaterThan(0);
  });
});

describe('environment', () => {
  test('backend is reachable', async () => {
    const res = await fetch(API_BASE + '/api/products');
    expect(res.ok).toBe(true);
  });
});
