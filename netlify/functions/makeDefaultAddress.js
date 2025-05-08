const User = require('./Models/users');
const connectDB = require('./utils/connectDB');
const authenticate = require('./utils/authenticate');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Step 1: Authenticate user using the separate authenticate function
    const cookiesHeader = event.headers.cookie;
    if (!cookiesHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'No cookies provided' }),
      };
    }

    const decoded = authenticate(cookiesHeader); // Decodes the JWT token to get user info
    const userId = decoded.id;

    // Step 2: Parse body for address index
    const { index } = JSON.parse(event.body);
    if (index === undefined || index < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing address index' }),
      };
    }

    // Step 3: Connect to MongoDB using the separate connectDB function
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    if (index >= user.address.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Address index out of range' }),
      };
    }

    // Step 4: Update default address
    user.address.forEach((addr) => {
      addr.isDefaultShippingAddress = false;
    });
    user.address[index].isDefaultShippingAddress = true;
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error in makeDefaultAddress:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
