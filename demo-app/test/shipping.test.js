const { computeShipping, FREE_SHIPPING_THRESHOLD_CENTS } = require('../shipping');

describe('computeShipping', () => {
  const AT_THRESHOLD = FREE_SHIPPING_THRESHOLD_CENTS;

  test('free shipping at and above the threshold', () => {
    expect(computeShipping(AT_THRESHOLD, 500)).toBe(0);
    expect(computeShipping(AT_THRESHOLD + 1, 9000)).toBe(0);
  });

  test('weight bands price correctly below the threshold', () => {
    expect(computeShipping(5000, 500)).toBe(495);   // light
    expect(computeShipping(5000, 1000)).toBe(495);  // boundary: light
    expect(computeShipping(5000, 1001)).toBe(995);  // standard
    expect(computeShipping(5000, 3000)).toBe(995);  // boundary: standard
    expect(computeShipping(5000, 3001)).toBe(1495); // heavy
  });

  test('threshold is a sane positive number', () => {
    expect(AT_THRESHOLD).toBeGreaterThan(0);
  });
});
