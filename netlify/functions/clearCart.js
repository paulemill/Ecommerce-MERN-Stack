const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/users');

// Extract and verify JWT from cookie
const authenticate = (cookieHeader) => {
  if (!cookieHeader) throw new Error('No cookies provided');

  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) throw new Error('Token not found in cookies');

  const token = tokenMatch[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.handler = async (event, context) => {
  // MongoDB connection logic inside the handler
  const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to the database');
    }
  };

  // Ensure method is DELETE
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    // Connect to MongoDB (reuse connection if already established)
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // Clear the cart
    user.cart = [];
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cart cleared successfully',
        cart: [],
        subTotal: 0,
        tax: 0,
        shipping: 0,
        totalAmount: 0,
      }),
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to clear cart' }),
    };
  }
};
