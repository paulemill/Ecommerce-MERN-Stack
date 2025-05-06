const { Schema } = require('mongoose');

const cartItemSchema = new Schema({
  productId: {
    type: Number,
    required: true,
  },
  title: String,
  price: Number,
  quantity: Number,
  currency: {
    type: String,
    default: 'usd',
  },
  image: String,
});

module.exports = cartItemSchema;
