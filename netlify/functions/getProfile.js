const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./Models/users');

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

  // Ensure method is GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const cookies = event.headers.cookie || ''; // Retrieve cookies from the request
  const token = cookies.split('; ').find((row) => row.startsWith('token='));

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No token found' }),
    };
  }

  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Verify token and get the decoded user ID
    const decoded = jwt.verify(token.split('=')[1], process.env.JWT_SECRET);

    // 3. Find the user in the database by ID and exclude the password
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // 4. Return the user data (excluding the password)
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error verifying token or fetching user:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid or expired token' }),
    };
  }
};
