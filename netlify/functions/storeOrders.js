const User = require('./Models/users');
const connectDB = require('./utils/connectDB');
const authenticate = require('./utils/authenticate');

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

    const { items, totalAmount, tax, shipping } = JSON.parse(event.body);

    // Connect to MongoDB
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Add the order to the user's order array
    user.orders.push({
      items,
      totalAmount,
      tax,
      shipping,
    });

    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order stored successfully',
        orders: user.orders,
      }),
    };
  } catch (error) {
    console.error('Error storing order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};
