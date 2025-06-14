const express = require('express');
require('./db');
const userRoutes = require('./user');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});

module.exports = app;
