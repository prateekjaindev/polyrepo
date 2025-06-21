const mongoose = require('../db');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
