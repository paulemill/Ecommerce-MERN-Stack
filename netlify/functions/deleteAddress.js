const connectDB = require('./utils/connectDB');
const authenticate = require('./utils/authenticate');
const User = require('./Models/users');

exports.handler = async (event, context) => {
  // Ensure method is DELETE
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // 1. Authenticate the user
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    // 2. Parse body and get address index to delete
    const { index } = JSON.parse(event.body);
    if (index === undefined || index < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing address index' }),
      };
    }

    // 3. Connect to DB and find the user
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // Check if the index is valid for the addresses array
    if (index >= user.address.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Address index out of range' }),
      };
    }

    // 4. Remove the address
    const wasDefault = user.address[index].isDefaultShippingAddress;
    user.address.splice(index, 1);

    // Set a new default address if the removed one was default
    if (wasDefault && user.address.length > 0) {
      user.address[0].isDefaultShippingAddress = true;
    }

    // Save the updated user document
    await user.save();

    // Return the updated user data
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error deleting address:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
