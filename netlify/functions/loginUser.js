const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/users');
const bcrypt = require('bcrypt');

// Connect to DB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL);
};

// Compare hashed passwords
const comparePasswords = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method is Not Allowed' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Password must be at least 6 characters',
        }),
      };
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid password' }),
      };
    }

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=86400; ${
          process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Lax' : ''
        }`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
