const express = require('express');
require('./db');
const orderRoutes = require('./order');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service' });
});

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});

module.exports = app;
