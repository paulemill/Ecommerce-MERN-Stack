const User = require('./Models/users');
const bcrypt = require('bcrypt');
const connectDB = require('./utils/connectDB');

// Hash password function
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { firstName, lastName, email, password, confirmPassword } =
      JSON.parse(event.body);

    // Validate input fields
    if (!firstName || !lastName || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    // Password validation
    if (password.length < 6) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Password must be at least 6 characters',
        }),
      };
    }

    if (password !== confirmPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Passwords do not match' }),
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Password must contain at least one uppercase letter',
        }),
      };
    }

    if (!/\d/.test(password)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Password must contain at least one number',
        }),
      };
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Connect to MongoDB
    await connectDB();

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is already taken' }),
      };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Respond with user details (without password)
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      }),
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
