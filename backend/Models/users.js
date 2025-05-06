const mongoose = require('mongoose');
const cartItemSchema = require('./cartItem');
const ordersSchema = require('./order');
const addressSchema = require('./useraddress');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: [addressSchema], // Array of addresses from address.js
  cart: [cartItemSchema], // Array of cart items from cartItem.js
  orders: [ordersSchema], // Array of orders from order.js
});

const User = mongoose.model('User', userSchema);

module.exports = User;
