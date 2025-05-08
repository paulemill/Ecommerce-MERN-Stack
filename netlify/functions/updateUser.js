const connectDB = require('./utils/connectDB');
const authenticate = require('./utils/authenticate');
const User = require('./Models/users');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Step 1: Authenticate user
    const decoded = authenticate(event.headers.cookie);
    const userId = decoded.id;

    // Step 2: Parse request body
    const { firstName, lastName, email } = JSON.parse(event.body);

    // Step 3: Connect to DB and find user
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // Step 4: Update user info
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    const updatedUser = await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      }),
    };
  } catch (error) {
    console.error('Error in update-info:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
