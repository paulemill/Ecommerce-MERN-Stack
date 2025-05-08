# Summary

Built with the MERN stack and styled using Tailwind CSS, this ecommerce app fetches product data from MongoDB and offers a seamless shopping experience with features like product search, filtering, and sorting. Users can register, log in, reset forgotten passwords, manage their addresses, and view their order history. The app includes a full-featured cart system with checkout and secure Stripe payment integration. It is deployed on Netlify, with the backend functionality converted into Netlify Functions for serverless payment processing.

# Deployed Link

https://swiftmart-mern.netlify.app/

# Payment Testing Instructions

When testing interactively, use the following details:

### Test Card Number

- **4242 4242 4242 4242**

Enter this card number in the Stripe Dashboard or in any payment form.

### Expiry Date

- Use a valid future date, such as **12/34**.

### CVC

- Use any **three-digit CVC** (or **four digits** for American Express cards).

### Other Fields

- You can use any value for other form fields.

✅ These details can be used for simulating successful payments during testing.
