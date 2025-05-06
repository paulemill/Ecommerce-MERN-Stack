const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/users');

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL);
};

// Extract and verify token from cookie
const authenticate = (cookieHeader) => {
  if (!cookieHeader) throw new Error('No cookies provided');

  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) throw new Error('Token not found in cookies');

  const token = tokenMatch[1];
  return jwt.verify(token, process.env.JWT_SECRET); // Decoded user info
};

exports.handler = async (event, context) => {
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
        body: JSON.stringify({ error: 'Invalid or missing address index' }),
      };
    }

    // 3. Connect to DB and find user
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    if (index >= user.address.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Address index out of range' }),
      };
    }

    // 4. Remove the address
    const wasDefault = user.address[index].isDefaultShippingAddress;
    user.address.splice(index, 1);

    // Set a new default if needed
    if (wasDefault && user.address.length > 0) {
      user.address[0].isDefaultShippingAddress = true;
    }

    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error deleting address:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
