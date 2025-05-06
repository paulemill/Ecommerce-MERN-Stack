const mongoose = require('mongoose');
const User = require('./Models/users');
const bcrypt = require('bcrypt');

// Connect to DB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL);
};

// Hash and compare helpers
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) reject(err);
      else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) reject(err);
          else resolve(hash);
        });
      }
    });
  });
};

const comparePasswords = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { email, newPassword, confirmNewPassword } = JSON.parse(event.body);

    if (!email || !newPassword || !confirmNewPassword) {
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

    if (newPassword.length < 6) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Password must be at least 6 characters',
        }),
      };
    }

    if (!/[A-Z]/.test(newPassword)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Password must contain at least one uppercase letter',
        }),
      };
    }

    if (!/\d/.test(newPassword)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Password must contain at least one number',
        }),
      };
    }

    if (newPassword !== confirmNewPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Passwords do not match' }),
      };
    }

    const isSameAsOld = await comparePasswords(newPassword, user.password);
    if (isSameAsOld) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'New password cannot be the same as the old one',
        }),
      };
    }

    const hashed = await hashPassword(newPassword);
    user.password = hashed;
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password updated successfully' }),
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
