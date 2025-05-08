const connectDB = require('./utils/connectDB');
const User = require('./Models/users');
const authenticate = require('./utils/authenticate');

exports.handler = async (event, context) => {
  // Ensure method is GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // 1. Authenticate the user using JWT from cookies
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    // 2. Connect to DB
    await connectDB();

    // 3. Find the user in the database, excluding the password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // 4. Return the user data
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
