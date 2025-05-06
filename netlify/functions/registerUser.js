const mongoose = require('mongoose');
const User = require(path.resolve(__dirname, '../../backend/models/users'));
const bcrypt = require('bcrypt');

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

// Connect to DB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL);
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

    if (!firstName || !lastName || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
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

    if (!/\S+@\S+\.\S+/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is taken already' }),
      };
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
