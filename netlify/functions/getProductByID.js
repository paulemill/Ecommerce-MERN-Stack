const mongoose = require('mongoose');
const Product = require('./Models/products');

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

  // Ensure method is GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Get the product ID from the query parameters
    const id = event.queryStringParameters.id;

    // 3. Find the product by custom ID
    const product = await Product.findOne({ id: id });

    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Product not found' }),
      };
    }

    // 4. Return the product
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
