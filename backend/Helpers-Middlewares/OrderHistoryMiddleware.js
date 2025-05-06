const jwt = require('jsonwebtoken');
const User = require('../Models/users');

const OrderHistoryMiddleware = async (req, res, next) => {
  // Check if the token is present in the cookies.
  // token is from the login function in AuthController and is stored in the cookies
  // when the user logs in,
  // it is used to authenticate the user when they try to access the cart
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ error: 'No token found - Authentication required' });
  } // if token is not present, it mean that the user is not logged in

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token using the secret key stored in the .env file
    console.log('Decoded token:', decoded);
    req.user = decoded; // decoded token contains the user id and other information
    next(); // call the next middleware or route handler
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = OrderHistoryMiddleware;
