const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require(path.resolve(__dirname, '../../backend/models/users'));

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL);
};

// Extract and verify JWT from cookie
const authenticate = (cookieHeader) => {
  if (!cookieHeader) throw new Error('No cookies provided');

  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) throw new Error('Token not found in cookies');

  const token = tokenMatch[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

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
