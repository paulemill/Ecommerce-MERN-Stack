const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require(path.resolve(__dirname, '../../backend/models/users'));

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL);
};

// JWT middleware logic
const authenticate = (cookieHeader) => {
  if (!cookieHeader) throw new Error('No cookies provided');

  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) throw new Error('Token not found in cookies');

  const token = tokenMatch[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    const { address } = JSON.parse(event.body);
    if (!address) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing address in request body' }),
      };
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // If first address, mark as default
    if (user.address.length === 0) {
      address.isDefaultShippingAddress = true;
    }

    user.address.push(address);
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error adding address:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add address' }),
    };
  }
};
