const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/users');

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL);
};

// JWT middleware logic
const authenticate = (cookieHeader) => {
  if (!cookieHeader) throw new Error('No cookies provided');

  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) throw new Error('Token not found in cookies');

  const token = tokenMatch[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

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
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    const { productId, quantity } = JSON.parse(event.body);
    if (!productId || quantity === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing productId or quantity in request body',
        }),
      };
    }

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

    const currentItem = user.cart[itemIndex];
    const newQuantity = Math.max(quantity, 1);
    const unitPrice = currentItem.price / currentItem.quantity;

    currentItem.quantity = newQuantity;
    currentItem.price = unitPrice * newQuantity;

    await user.save();

    const { subTotal, tax, shipping, totalAmount } = calculateCartTotals(
      user.cart
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cart updated successfully',
        cart: user.cart,
        subTotal,
        tax,
        shipping,
        totalAmount,
      }),
    };
  } catch (error) {
    console.error('Error updating cart:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update cart' }),
    };
  }
};
