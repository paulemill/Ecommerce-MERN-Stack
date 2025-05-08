const connectDB = require('./utils/connectDB');
const authenticate = require('./utils/authenticate');
const User = require('./Models/users');

exports.handler = async (event, context) => {
  // Ensure method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Authenticate and get the userId from JWT token
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    // Parse the request body for address
    const { address } = JSON.parse(event.body);
    if (!address) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing address in request body' }),
      };
    }

    // Connect to MongoDB (reuse connection if already established)
    await connectDB();

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // If this is the user's first address, mark it as default
    if (user.address.length === 0) {
      address.isDefaultShippingAddress = true;
    }

    // Add the new address and save the user
    user.address.push(address);
    await user.save();

    // Return the updated user info
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
