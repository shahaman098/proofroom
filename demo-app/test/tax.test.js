const { computeTax, TAX_REGIONS, regionLabel } = require('../tax');

describe('computeTax', () => {
  test('region rates are applied to a cents-precision subtotal', () => {
    expect(computeTax(10000, 'DE')).toBe(1900); // 19% of €100.00
    expect(computeTax(10000, 'UK')).toBe(2000); // 20%
    expect(computeTax(10000, 'US')).toBe(700);  // 7%
  });

  test('unknown regions are tax-free in this demo store', () => {
    expect(computeTax(10000, 'ZZ')).toBe(0);
    expect(computeTax(10000, undefined)).toBe(0);
  });

  test('tax is rounded to whole cents', () => {
    expect(computeTax(3333, 'DE')).toBe(633); // 633.27 -> 633
  });

  test('every region has a name and a sane rate', () => {
    for (const rule of Object.values(TAX_REGIONS)) {
      expect(typeof rule.name).toBe('string');
      expect(rule.rate).toBeGreaterThan(0);
      expect(rule.rate).toBeLessThan(1);
    }
  });

  test('regionLabel resolves names and falls back gracefully', () => {
    expect(regionLabel('DE')).toBe('Germany');
    expect(regionLabel('ZZ')).toContain('Rest of World');
  });
});
