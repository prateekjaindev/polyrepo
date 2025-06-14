const mongoose = require('../db');

const itemSchema = new mongoose.Schema({
  productId: String,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [itemSchema],
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
