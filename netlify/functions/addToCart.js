const connectDB = require('./utils/connectDB');
const authenticate = require('./utils/authenticate');
const User = require('./Models/users');

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

    // Parse the request body for product details
    const { productId, title, price, quantity, image } = JSON.parse(event.body);
    if (!productId || !title || !price || !quantity || !image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required product fields' }),
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

    let message = 'Item added to cart';

    // Check if the product already exists in the cart
    const existingIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingIndex !== -1) {
      // Update quantity and price if the product already exists in the cart
      user.cart[existingIndex].quantity += quantity;
      user.cart[existingIndex].price =
        price * user.cart[existingIndex].quantity;
      message = 'Item quantity updated in cart';
    } else {
      // Add the new item to the cart
      user.cart.push({
        productId,
        title,
        price: price * quantity,
        quantity,
        image,
      });
    }

    // Save the updated user
    await user.save();

    // Calculate the new cart totals
    const { subTotal, tax, shipping, totalAmount } = calculateCartTotals(
      user.cart
    );

    // Return the updated cart summary
    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
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
    console.error('Error adding to cart:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add item to cart' }),
    };
  }
};
