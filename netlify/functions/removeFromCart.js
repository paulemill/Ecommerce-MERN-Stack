const User = require('./Models/users');
const connectDB = require('./utils/connectDB');
const authenticate = require('./utils/authenticate');

// Calculate cart totals
const calculateCartTotals = (cart) => {
  const subTotal = parseFloat(
    cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)
  );
  const tax = parseFloat((subTotal * 0.1).toFixed(2));
  const shipping = cart.length > 0 ? 10 : 0;
  const totalAmount = parseFloat((subTotal + tax + shipping).toFixed(2));

  return { subTotal, tax, shipping, totalAmount };
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    const { productId } = JSON.parse(event.body);
    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing productId in request body' }),
      };
    }

    // Connect to MongoDB
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found in cart' }),
      };
    }

    // Remove the item from the cart
    user.cart.splice(itemIndex, 1);
    await user.save();

    const { subTotal, tax, shipping, totalAmount } = calculateCartTotals(
      user.cart
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Item removed from cart',
        cart: user.cart,
        subTotal,
        tax,
        shipping,
        totalAmount,
      }),
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to remove item from cart' }),
    };
  }
};
