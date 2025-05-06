const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/users');

// Utility function: Connect to MongoDB
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

// Utility function: Middleware-style JWT auth
const authenticate = (cookiesHeader) => {
  if (!cookiesHeader) throw new Error('No cookies found');

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

    // Step 2: Parse request body
    const { firstName, lastName, email } = JSON.parse(event.body);

    // Step 3: Connect to DB and find user
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // Step 4: Update user info
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    const updatedUser = await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      }),
    };
  } catch (error) {
    console.error('Error in update-info:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
