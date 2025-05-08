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
    // 1. Authenticate the user
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    // 2. Parse body and get order index to delete
    const { index } = JSON.parse(event.body);
    if (index === undefined || index < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing order index' }),
      };
    }

    // 3. Connect to DB and find the user
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Check if the order index is valid
    if (index >= user.orders.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Order index out of range' }),
      };
    }

    // 4. Delete the order from the history
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
