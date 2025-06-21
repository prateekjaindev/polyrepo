const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const router = express.Router();
const Order = require('./models/Order');

// Configuration
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3003';

// Helper function to validate product availability
async function validateProduct(productId, quantity) {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);
    return response.data.stock >= quantity;
  } catch (error) {
    console.error('Error validating product:', error.message);
    return false;
  }
}

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Get order by ID
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// Create order
router.post(
  '/',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productId').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, items } = req.body;

    try {
      // Validate all products in the order
      const productValidations = await Promise.all(
        items.map(async (item) => {
          const isValid = await validateProduct(item.productId, item.quantity);
          return { ...item, isValid };
        })
      );

      const invalidItems = productValidations.filter(item => !item.isValid);
      if (invalidItems.length > 0) {
        return res.status(400).json({
          message: 'Some products are not available in the requested quantities',
          invalidItems: invalidItems.map(({ productId }) => productId)
        });
      }

      // Create order
      const newOrder = new Order({
        userId,
        items,
        status: 'pending'
      });
      await newOrder.save();
      
      // In a real application, you would update product stock here
      // and implement a transaction/saga pattern for consistency

      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order' });
    }
  }
);

// Update order status
router.patch(
  '/:id/status',
  [
    body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  }
);

// Cancel order
router.patch('/:id/cancel', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({
      message: `Cannot cancel order with status: ${order.status}`
    });
  }

  order.status = 'cancelled';
  order.updatedAt = new Date();
  await order.save();
  res.json(order);
});

module.exports = router;
