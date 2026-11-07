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

  // NOTE: discount handling through calculateTotal() is intentionally
  // not covered yet — see workflow/room-instructions.md (seeded bugs).
});

describe('discount catalogue', () => {
  test('every code has a supported type and value', () => {
    for (const rule of Object.values(DISCOUNT_CODES)) {
      expect(['percent', 'flat']).toContain(rule.type);
      expect(rule.value).toBeGreaterThan(0);
    }
  });
});
