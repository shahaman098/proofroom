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
  test('returns 400 and does NOT deduct in-stock items when one item exceeds stock', async () => {
    const freshApp = require('../server');
    // First order: exhaust all hub stock legitimately.
    await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'hub', qty: 5 }] });

    // Now hub stock = 0; ordering mouse (in stock) + hub (0) together must
    // be rejected AND must not deduct the mouse stock.
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'mouse', qty: 1 }, { id: 'hub', qty: 1 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/stock/i);

    // Verify mouse stock is untouched (still 12 — no partial deduction).
    const products = await request(freshApp).get('/api/products');
    const mouse = products.body.find((p) => p.id === 'mouse');
    expect(mouse.stock).toBe(12);
  });

  // Regression: duplicate line items for the same product in one cart must
  // not sneak past per-line validation and drive stock negative.
  test('returns 400 when duplicate line items together exceed stock', async () => {
    const freshApp = require('../server');
    // hub stock = 5; two lines of qty:3 total 6 — should be rejected.
    const res = await request(freshApp)
      .post('/api/checkout')
      .send({ items: [{ id: 'hub', qty: 3 }, { id: 'hub', qty: 3 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/stock/i);
  });
});
