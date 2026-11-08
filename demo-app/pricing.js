// QuickCart pricing engine — pure functions, easy to test.

const DISCOUNT_CODES = {
  SAVE10: { type: 'percent', value: 10 },
  SAVE20: { type: 'percent', value: 20 },
  WELCOME5: { type: 'flat', value: 5 },
};

// BUG #1 (seeded): the discount code coming from checkout is silently
// dropped — customers type SAVE20 and pay full price. applyDiscount()
// is correct, but calculateTotal never passes the code through.
//
// BUG #2 (seeded): returns raw floating-point totals (e.g. 3 x 19.99
// = 59.97000000000001). Money should be rounded to cents before it
// ever reaches the customer's bank charge.
function calculateTotal(items, discountCode) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = applyDiscount(subtotal, discountCode);
  return parseFloat((subtotal - discount).toFixed(2));
}

function applyDiscount(subtotal, code) {
  if (!code) return 0;
  const rule = DISCOUNT_CODES[code];
  if (!rule) return 0;
  if (rule.type === 'percent') return (subtotal * rule.value) / 100;
  if (rule.type === 'flat') return Math.min(rule.value, subtotal);
  return 0;
}

module.exports = { DISCOUNT_CODES, calculateTotal, applyDiscount };
