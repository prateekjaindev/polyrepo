const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const router = express.Router();

// Mock database
let orders = [];

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
router.get('/', (req, res) => {
  res.json(orders);
});

// Get order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
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
      const newOrder = {
        id: Date.now().toString(),
        userId,
        items,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      orders.push(newOrder);
      
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = {
      ...orders[orderIndex],
      status: req.body.status,
      updatedAt: new Date().toISOString()
    };

    orders[orderIndex] = updatedOrder;
    res.json(updatedOrder);
  }
);

// Cancel order
router.patch('/:id/cancel', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (['shipped', 'delivered', 'cancelled'].includes(orders[orderIndex].status)) {
    return res.status(400).json({ 
      message: `Cannot cancel order with status: ${orders[orderIndex].status}` 
    });
  }

  const updatedOrder = {
    ...orders[orderIndex],
    status: 'cancelled',
    updatedAt: new Date().toISOString()
  };

  orders[orderIndex] = updatedOrder;
  res.json(updatedOrder);
});

module.exports = router;
