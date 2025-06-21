const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/auth-service';

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Auth service connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
