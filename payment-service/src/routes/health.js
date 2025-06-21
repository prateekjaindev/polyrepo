const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check MongoDB connection
    const isMongoConnected = mongoose.connection.readyState === 1;
    
    if (!isMongoConnected) {
      throw new Error('MongoDB connection not established');
    }
    
    res.status(200).json({
      status: 'ok',
      message: 'Payment Service is healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      message: 'Service Unavailable',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
