const express = require('express');
require('./db');
const productRoutes = require('./product');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'product-service' });
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});

module.exports = app;
