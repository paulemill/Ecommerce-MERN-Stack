const jwt = require('jsonwebtoken');

const requireAuthForCart = (req, res, next) => {
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
    req.user = decoded; // decoded token contains the user id and other information
    next(); // call the next middleware or route handler
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = requireAuthForCart;

// this middleware is used to protect the cart routes so that only logged in users can access them
// it can be seen on the cart routes in the CartRoutes.js file

/*
FLOW SUMMARY

[Login] --> JWT token with user id --> stored in cookie
      ↓
[Request /cart] --> requireAuth middleware
      ↓
Token decoded → req.user = { id, email... }
      ↓
Controller uses req.user.id → User.findById(req.user.id)

*/
