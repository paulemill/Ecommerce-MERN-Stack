const dotenv = require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const stripeRoutes = require('./Routes/stripeRoutes');
const productsRoutes = require('./Routes/productsRoutes');
const productByIDRoutes = require('./Routes/productByIDRoutes');
const authRoutes = require('./Routes/AuthRoutes');
const cartRoutes = require('./Routes/CartRoutes');
const addressRoutes = require('./Routes/AddressRoutes');
const orderHistoryRoutes = require('./Routes/OrderHistoryRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected..'))
  .catch((err) => console.log(err));

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', //Frontend URL
    credentials: true,
  })
);

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/stripe', stripeRoutes);
app.use('/api', productsRoutes);
app.use('/api', productByIDRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/address', addressRoutes);
app.use('/orders', orderHistoryRoutes);

app.listen(PORT, () => console.log('Listening on port 4000'));
