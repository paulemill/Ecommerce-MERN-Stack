const connectDB = require('./utils/connectDB');
const authenticate = require('./utils/authenticate');
const User = require('./Models/users');

exports.handler = async (event, context) => {
  // Ensure method is DELETE
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Authenticate and get the userId from JWT token
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

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

    // Clear the cart
    user.cart = [];
    await user.save();

    // Return the response with an empty cart and reset totals
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cart cleared successfully',
        cart: [],
        subTotal: 0,
        tax: 0,
        shipping: 0,
        totalAmount: 0,
      }),
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to clear cart' }),
    };
  }
};
