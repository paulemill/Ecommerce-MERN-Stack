const connectDB = require('./utils/connectDB');
const Product = require('./Models/products');

exports.handler = async (event, context) => {
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

    // 2. Get the product ID from query parameters
    const { id } = event.queryStringParameters;

    // 3. Find the product by ID
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
      body: JSON.stringify({ error: 'Failed to fetch product' }),
    };
  }
};
