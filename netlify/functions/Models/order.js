const { Schema } = require('mongoose');

const ordersSchema = new Schema({
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalAmount: Number,
  tax: Number, // Add tax field
  shipping: Number, // Add shipping field
  date: { type: Date, default: Date.now },
});

module.exports = ordersSchema;
