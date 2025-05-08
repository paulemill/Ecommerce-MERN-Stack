const connectDB = require('./utils/connectDB');
const authenticate = require('./utils/authenticate');
const User = require('./Models/users');

const calculateCartTotals = (cart) => {
  const subTotal = parseFloat(
    cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)
  );
  const tax = parseFloat((subTotal * 0.1).toFixed(2)); // 10% tax
  const shipping = cart.length > 0 ? 10 : 0; // flat rate shipping
  const totalAmount = parseFloat((subTotal + tax + shipping).toFixed(2));

  return { subTotal, tax, shipping, totalAmount };
};

exports.handler = async (event, context) => {
  // Ensure method is GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // 1. Authenticate the user
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    // 2. Connect to DB and find the user
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // 3. Calculate cart totals
    const { subTotal, tax, shipping, totalAmount } = calculateCartTotals(
      user.cart
    );

    // 4. Return the cart summary
    return {
      statusCode: 200,
      body: JSON.stringify({
        cartSummary: {
          items: user.cart,
          subTotal,
          tax,
          shipping,
          totalAmount,
        },
      }),
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch cart' }),
    };
  }
};
