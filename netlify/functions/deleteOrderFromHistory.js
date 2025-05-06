const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/users');

// Authenticate user from cookie
const authenticate = (cookieHeader) => {
  if (!cookieHeader) throw new Error('No cookies provided');

  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) throw new Error('Token not found in cookies');

  const token = tokenMatch[1];
  return jwt.verify(token, process.env.JWT_SECRET); // Decoded user info
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
    // 1. Authenticate the user
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    // 2. Parse body and get index
    const { index } = JSON.parse(event.body);
    if (index === undefined || index < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing order index' }),
      };
    }

    // 3. Connect to DB and find user
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    if (index >= user.orders.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Order index out of range' }),
      };
    }

    // 4. Delete the order
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
