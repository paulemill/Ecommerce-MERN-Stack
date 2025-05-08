const mongoose = require('mongoose');

let isConnected = false; // Track if it is already connected to the database

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return; // Reuse existing connection
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1; // Set connection state
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to the database');
  }
};

module.exports = connectDB;
