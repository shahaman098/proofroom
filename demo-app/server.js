// QuickCart — a tiny checkout service. Demo "production" app for Ship Room.
// Seeded bugs are intentional; see workflow/room-instructions.md.

const express = require('express');
const path = require('path');
const { calculateTotal } = require('./pricing');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PRODUCTS = [
  { id: 'mouse', name: 'Silent Mouse', price: 19.99, stock: 12 },
  { id: 'kbd', name: 'Compact Keyboard', price: 49.5, stock: 8 },
  { id: 'hub', name: 'USB-C Hub', price: 32.0, stock: 5 },
];

app.get('/api/products', (req, res) => res.json(PRODUCTS));

// BUG #3 (seeded): no stock validation — customers can order more units
// than exist, and stock silently goes negative.
app.post('/api/checkout', (req, res) => {
  const { items, discountCode } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) return res.status(400).json({ error: `Unknown product: ${item.id}` });
    product.stock -= item.qty;
  }

  // Look up current catalog prices for everything in the cart.
  const priced = items.map((item) => ({
    id: item.id,
    price: PRODUCTS.find((p) => p.id === item.id).price,
    qty: item.qty,
  }));

  const total = calculateTotal(priced, discountCode);
  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
  res.json({ orderId, total, discountApplied: discountCode || null });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`QuickCart running at http://localhost:${PORT}`));
}

module.exports = app;
