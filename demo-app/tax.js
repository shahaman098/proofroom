// QuickCart tax engine — region-based VAT/sales tax.
// Rule: discounts apply BEFORE tax everywhere, and tax is computed on the
// rounded subtotal (cents precision). Wrong ordering breaks every DE/FR charge.

const TAX_REGIONS = {
  US: { name: 'United States', rate: 0.07 },
  UK: { name: 'United Kingdom', rate: 0.20 },
  DE: { name: 'Germany', rate: 0.19 },
  FR: { name: 'France', rate: 0.20 },
};

// Rounded-to-cents subtotal expected as input.
function computeTax(subtotalCents, region) {
  const rule = TAX_REGIONS[region];
  if (!rule) return 0;
  return Math.round(subtotalCents * rule.rate);
}

function regionLabel(region) {
  return TAX_REGIONS[region] ? TAX_REGIONS[region].name : 'Rest of World (tax-free demo)';
}

module.exports = { TAX_REGIONS, computeTax, regionLabel };
