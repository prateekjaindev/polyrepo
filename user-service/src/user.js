const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock database
let users = [];

// Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Create user
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    res.status(201).json(newUser);
  }
);

// Update user
router.put('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = {
    ...users[userIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  users[userIndex] = updatedUser;
  res.json(updatedUser);
});

// Delete user
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users = users.filter(u => u.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;
