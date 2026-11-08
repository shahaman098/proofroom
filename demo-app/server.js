// QuickCart — a tiny checkout service. Demo "production" app for Ship Room.
// Seeded bugs are intentional; see workflow/room-instructions.md.

const express = require('express');
const path = require('path');
const { calculateTotal } = require('./pricing');
const { computeTax, regionLabel } = require('./tax');
const { computeShipping } = require('./shipping');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PRODUCTS = [
  { id: 'mouse', name: 'Silent Mouse', price: 19.99, stock: 12 },
  { id: 'kbd', name: 'Compact Keyboard', price: 49.5, stock: 8 },
  { id: 'hub', name: 'USB-C Hub', price: 32.0, stock: 5 },
];

app.get('/api/products', (req, res) => res.json(PRODUCTS));

app.post('/api/checkout', (req, res) => {
  const { items, discountCode } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Validate products and stock for all items before deducting anything,
  // so a failed order never partially reduces inventory.
  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) return res.status(400).json({ error: `Unknown product: ${item.id}` });
    if (item.qty > product.stock) {
      return res.status(400).json({ error: `Insufficient stock for ${item.id}: requested ${item.qty}, available ${product.stock}` });
    }
  }

  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.id);
    product.stock -= item.qty;
  }

  // Look up current catalog prices for everything in the cart.
  const priced = items.map((item) => ({
    id: item.id,
    price: PRODUCTS.find((p) => p.id === item.id).price,
    qty: item.qty,
  }));

  const region = (req.body && req.body.region) || 'US';
  const weightGrams = (req.body && req.body.weightGrams) || 500;

  // All money math in integer cents from here on.
  const subtotalCents = Math.round(priced.reduce((s, it) => s + it.price * it.qty, 0) * 100);
  const afterDiscountCents = Math.round(calculateTotal(priced, discountCode) * 100);
  const discountCents = subtotalCents - afterDiscountCents;

  const taxCents = computeTax(afterDiscountCents, region);
  const shippingCents = computeShipping(afterDiscountCents, weightGrams);
  const grandTotalCents = afterDiscountCents + taxCents + shippingCents;

  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
  res.json({
    orderId,
    region,
    regionName: regionLabel(region),
    subtotal: subtotalCents / 100,
    discount: discountCents / 100,
    discountApplied: discountCode || null,
    tax: taxCents / 100,
    shipping: shippingCents / 100,
    total: grandTotalCents / 100,
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`QuickCart running at http://localhost:${PORT}`));
}

module.exports = app;
