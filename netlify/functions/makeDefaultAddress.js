const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require(path.resolve(__dirname, '../../backend/models/users'));

// Utility function: Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL);
};

// Utility function: Middleware-style JWT auth
const authenticate = (cookiesHeader) => {
  if (!cookiesHeader) throw new Error('No cookies found');

  // Extract token from "token=...;" format
  const tokenMatch = cookiesHeader.match(/token=([^;]+)/);
  if (!tokenMatch) throw new Error('Token not found in cookies');

  const token = tokenMatch[1];
  return jwt.verify(token, process.env.JWT_SECRET); // Returns decoded user
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Step 1: Authenticate user
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    // Step 2: Parse body
    const { index } = JSON.parse(event.body);
    if (index === undefined || index < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing address index' }),
      };
    }

    // Step 3: Connect to MongoDB and find user
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

    // Step 4: Update default address
    user.address.forEach((addr) => {
      addr.isDefaultShippingAddress = false;
    });
    user.address[index].isDefaultShippingAddress = true;
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error in makeDefaultAddress:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
