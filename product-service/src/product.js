const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock database
let products = [];

// Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Create product
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('stock').isInt({ min: 0 }).withMessage('Stock cannot be negative')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, stock } = req.body;
    const newProduct = {
      id: Date.now().toString(),
      name,
      description: description || '',
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  }
);

// Update product
router.put(
  '/:id',
  [
    body('price').if(body('price').exists()).isFloat({ gt: 0 }),
    body('stock').if(body('stock').exists()).isInt({ min: 0 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  }
);

// Delete product
router.delete('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;
