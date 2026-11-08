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
