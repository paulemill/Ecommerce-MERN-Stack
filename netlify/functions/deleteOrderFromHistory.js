const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/users');

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL);
};

// Authenticate user from cookie
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

    const { index } = JSON.parse(event.body);

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    if (index < 0 || index >= user.orders.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid order index' }),
      };
    }

    user.orders.splice(index, 1);
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete order' }),
    };
  }
};
