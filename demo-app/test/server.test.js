const request = require('supertest');
const app = require('../server');

// Each test suite re-requires the app so PRODUCTS stock is reset.
// Jest caches modules between tests in the same file, so we reset
// stock manually before each test via the PRODUCTS export.

// hub has stock: 5 — a convenient low-stock item for over-order tests.
describe('POST /api/checkout — stock validation', () => {
  beforeEach(() => {
    // Reset module cache so PRODUCTS reverts to initial stock values.
    jest.resetModules();
  });

  test('succeeds when qty is within stock', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'hub', qty: 3 }] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('orderId');
  });

  test('succeeds when qty equals exact stock', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'hub', qty: 5 }] });
    expect(res.status).toBe(200);
  });

  // Regression: ordering more units than in stock silently drove stock negative.
  test('returns 400 when qty exceeds stock', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'hub', qty: 10 }] }); // stock is only 5
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/stock/i);
  });

  // Regression: a mixed cart where one item is over-stock must not partially
  // deduct the in-stock items before rejecting (no partial fulfilment).
  test('returns 400 and does not deduct stock when one item exceeds stock', async () => {
    const freshApp = require('../server');
    // First order: exhaust all hub stock legitimately.
    // Then order mouse (plenty of stock) + hub (now 0) in the same cart.
    await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'hub', qty: 5 }] });

    // Now hub stock = 0; ordering 1 hub alongside mouse should be rejected.
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'mouse', qty: 1 }, { id: 'hub', qty: 1 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/stock/i);
  });
});

describe('POST /api/checkout — quantity validation', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  // Security regression: a negative qty bypasses the stock check (−3 > 12 is false)
  // and produces a negative total — the store would pay the customer. It also
  // increments stock (product.stock -= −3 adds 3), corrupting inventory.
  //   qty: −3, mouse price: 19.99 → subtotal: −59.97, total negative
  test('returns 400 when qty is negative', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'mouse', qty: -3 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/quantity|qty/i);
  });

  // A zero qty is a no-op that should not produce a successful order.
  test('returns 400 when qty is zero', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'mouse', qty: 0 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/quantity|qty/i);
  });

  // Verify that a negative qty does NOT corrupt stock (stock must stay at 12).
  test('does not modify stock when qty is negative', async () => {
    const freshApp = require('../server');
    await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'mouse', qty: -3 }] });
    const products = await request(freshApp).get('/api/products');
    const mouse = products.body.find((p) => p.id === 'mouse');
    expect(mouse.stock).toBe(12); // must be unchanged
  });

  // Adversarial regression: mixed cart — valid first item, invalid second item.
  // The fix must reject the entire order (not just skip the bad item) and must
  // NOT deduct stock for the valid item that appeared before the invalid one.
  // Without the two-pass structure (validate-all, then deduct-all), a naive
  // implementation could deduct mouse stock before it hits the bad hub qty.
  //   items: [{mouse, qty:2}, {hub, qty:-1}]
  //   Expected: 400, mouse.stock stays 12 (not 10).
  test('mixed cart: rejects entire order and leaves stock untouched when second item has invalid qty', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'mouse', qty: 2 }, { id: 'hub', qty: -1 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/quantity|qty/i);
    // hub is the invalid item — error should identify it
    expect(res.body.error).toMatch(/hub/i);
    // mouse stock must NOT have been deducted before the rejection
    const products = await request(freshApp).get('/api/products');
    const mouse = products.body.find((p) => p.id === 'mouse');
    expect(mouse.stock).toBe(12);
  });
});

describe('POST /api/checkout — tax on discounted total', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  // Regression: tax was computed on the pre-discount subtotal, overcharging
  // every customer who used a discount code in a taxed region (DE/UK/FR/US).
  // Repro: 3×Silent Mouse (3×19.99 = €59.97) + SAVE20 shipped to DE.
  //   Pre-discount subtotal : 5997 cents
  //   After discount (20%)  : 4798 cents
  //   Buggy tax  (19% of 5997): Math.round(5997*0.19) = 1139 cents  ← overcharge
  //   Correct tax (19% of 4798): Math.round(4798*0.19) =  912 cents
  test('DE tax is computed on the after-discount amount, not the subtotal', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'mouse', qty: 3 }], discountCode: 'SAVE20', region: 'DE' });

    expect(res.status).toBe(200);
    expect(res.body.subtotal).toBe(59.97);
    expect(res.body.discount).toBe(11.99);  // 20% of 5997 cents = 1199 cents
    // Tax must be 19% of the discounted total (4798 cents = €47.98), not the subtotal.
    // Correct: Math.round(4798 * 0.19) = 912 cents = €9.12
    // Buggy:   Math.round(5997 * 0.19) = 1139 cents = €11.39  (€2.27 overcharge)
    expect(res.body.tax).toBe(9.12);
  });

  // Adversarial regression: flat discount code (WELCOME5) + FR VAT (20%).
  // The existing test only covers a percent code (SAVE20) in DE. This test
  // catches any code path that forgets to use afterDiscount for flat codes,
  // or for regions other than DE.
  //   kbd subtotal : 4950 cents (€49.50)
  //   WELCOME5 flat -$5 → afterDiscount : 4450 cents (€44.50)
  //   Correct tax (20% of 4450): Math.round(4450*0.20) = 890 cents = €8.90
  //   Buggy tax   (20% of 4950): Math.round(4950*0.20) = 990 cents = €9.90  ← €1.00 overcharge
  test('FR tax uses after-discount base for a flat discount code (WELCOME5)', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'kbd', qty: 1 }], discountCode: 'WELCOME5', region: 'FR' });

    expect(res.status).toBe(200);
    expect(res.body.subtotal).toBe(49.50);
    expect(res.body.discount).toBe(5.00);
    // Correct: €8.90; buggy pre-fix path would return €9.90 (€1.00 overcharge).
    expect(res.body.tax).toBe(8.90);
    // Grand total must reconcile: 44.50 + 8.90 + 4.95 = 58.35
    expect(res.body.grandTotal).toBe(58.35);
    expect(res.body.taxBreakdown).toEqual({ tax: 8.90, shipping: 4.95 });
  });
});

describe('POST /api/checkout — backward compatibility (v1.2 mobile contract)', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  // Backward-compat regression: PR #5 renamed 'total' → 'grandTotal' and removed
  // the 'total' field. v1.2 mobile binaries were shipped before PR #5 and can only
  // read 'total' — 'grandTotal' did not exist when they were compiled.
  // Fix: keep 'total' as a deprecated alias alongside 'grandTotal'.
  test('response includes legacy "total" field equal to grandTotal (v1.2 backward compat)', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'mouse', qty: 1 }] });
    expect(res.status).toBe(200);
    // New contract: grandTotal must be present.
    expect(res.body.grandTotal).toBeDefined();
    // Old contract: total must still be present and equal grandTotal.
    expect(res.body.total).toBeDefined();
    expect(res.body.total).toBe(res.body.grandTotal);
  });

  // Both fields must hold the correct value (not just be equal to each other).
  test('total and grandTotal both equal the correct computed grand total', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'mouse', qty: 1 }], region: 'US' });
    expect(res.status).toBe(200);
    // 19.99 + 7% US tax (1399 cents → 98 cents) + standard shipping (495 cents)
    // grandTotal = afterDiscount + tax + shipping = 1999 + 140 + 495 = 2634 cents = 26.34
    const expected = res.body.grandTotal;
    expect(expected).toBeGreaterThan(0);
    expect(res.body.total).toBe(expected);
  });

  // X-API-Version header must be present so clients can negotiate the API version.
  test('response includes X-API-Version header set to "2"', async () => {
    const freshApp = require('../server');
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'hub', qty: 1 }] });
    expect(res.status).toBe(200);
    expect(res.headers['x-api-version']).toBe('2');
  });
});
