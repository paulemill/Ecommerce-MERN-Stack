const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require(path.resolve(__dirname, '../../backend/models/users'));

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
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    const { productId, title, price, quantity, image } = JSON.parse(event.body);
    if (!productId || !title || !price || !quantity || !image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required product fields' }),
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

    let message = 'Item added to cart';

    const existingIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingIndex !== -1) {
      user.cart[existingIndex].quantity += quantity;
      user.cart[existingIndex].price =
        price * user.cart[existingIndex].quantity;
      message = 'Item quantity updated in cart';
    } else {
      user.cart.push({
        productId,
        title,
        price: price * quantity,
        quantity,
        image,
      });
    }

    await user.save();

    const { subTotal, tax, shipping, totalAmount } = calculateCartTotals(
      user.cart
    );

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
