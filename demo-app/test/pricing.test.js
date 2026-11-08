const { calculateTotal, applyDiscount, DISCOUNT_CODES } = require('../pricing');

describe('applyDiscount', () => {
  test('returns 0 for missing or unknown codes', () => {
    expect(applyDiscount(100, undefined)).toBe(0);
    expect(applyDiscount(100, 'FAKE_CODE')).toBe(0);
  });

  test('applies percent codes', () => {
    expect(applyDiscount(100, 'SAVE10')).toBeCloseTo(10, 2);
    expect(applyDiscount(59.97, 'SAVE20')).toBeCloseTo(11.994, 2);
  });

  test('flat codes never discount below zero', () => {
    expect(applyDiscount(3, 'WELCOME5')).toBe(3);
    expect(applyDiscount(50, 'WELCOME5')).toBe(5);
  });
});

describe('calculateTotal', () => {
  const cart = [
    { id: 'mouse', price: 19.99, qty: 3 },
    { id: 'hub', price: 32.0, qty: 1 },
  ];

  test('sums items without a code', () => {
    expect(calculateTotal(cart)).toBeCloseTo(91.97, 2);
  });

  // Regression: SAVE20 on 3×mouse (3 × 19.99 = 59.97) was ignored and
  // customers were charged full price (bug: null passed instead of code).
  test('applies SAVE20 to the reported 3×mouse cart', () => {
    const mouseCart = [{ id: 'mouse', price: 19.99, qty: 3 }];
    // 20% off 59.97 = 47.976 → rounded to cents → 47.98
    expect(calculateTotal(mouseCart, 'SAVE20')).toBe(47.98);
  });

  // Regression: totals must be rounded to cents — raw float arithmetic like
  // 3 × 2.10 = 6.300000000000001 must not reach a bank charge (bug: no rounding).
  test('rounds total to exactly 2 decimal places', () => {
    const floatCart = [{ id: 'widget', price: 2.1, qty: 3 }];
    // Raw JS: 2.1 * 3 = 6.300000000000001; correct charge = 6.30
    expect(calculateTotal(floatCart)).toBe(6.30);
  });
});

describe('discount catalogue', () => {
  test('every code has a supported type and value', () => {
    for (const rule of Object.values(DISCOUNT_CODES)) {
      expect(['percent', 'flat']).toContain(rule.type);
      expect(rule.value).toBeGreaterThan(0);
    }
  });
});
