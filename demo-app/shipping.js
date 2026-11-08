// QuickCart shipping — flat by weight band, free over a threshold.
// Rule: free shipping threshold applies to the PRE-tax subtotal in cents.

const FREE_SHIPPING_THRESHOLD_CENTS = 7500; // $75.00 pre-tax

function computeShipping(subtotalCents, weightGrams) {
  if (subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  if (weightGrams <= 1000) return 495;      // light
  if (weightGrams <= 3000) return 995;      // standard
  return 1495;                              // heavy
}

module.exports = { FREE_SHIPPING_THRESHOLD_CENTS, computeShipping };
