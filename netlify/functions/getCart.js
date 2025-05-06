const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/users');

exports.handler = async (event, context) => {
  // MongoDB connection logic inside the handler
  const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to the database');
    }
  };

  // JWT middleware logic inside the handler
  const authenticate = (cookieHeader) => {
    if (!cookieHeader) throw new Error('No cookies provided');

    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) throw new Error('Token not found in cookies');

    const token = tokenMatch[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  };

  // Calculate cart totals logic inside the handler
  const calculateCartTotals = (cart) => {
    const subTotal = parseFloat(
      cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)
    );
    const tax = parseFloat((subTotal * 0.1).toFixed(2));
    const shipping = cart.length > 0 ? 10 : 0;
    const totalAmount = parseFloat((subTotal + tax + shipping).toFixed(2));

    return { subTotal, tax, shipping, totalAmount };
  };

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

    // 2. Connect to DB and find user
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
