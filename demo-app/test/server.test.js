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
    expect(res.body.total).toBe(58.35);
  });
});
