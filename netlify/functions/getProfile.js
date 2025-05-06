const jwt = require('jsonwebtoken');
const User = require('./Models/users');

exports.handler = async (event, context) => {
  // Check if the method is GET
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
    const decoded = jwt.verify(token.split('=')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from the response

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

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
