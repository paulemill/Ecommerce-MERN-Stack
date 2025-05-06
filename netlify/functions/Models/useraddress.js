const { Schema } = require('mongoose');

const addressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  isDefaultShippingAddress: { type: Boolean, default: false },
});

module.exports = addressSchema;
