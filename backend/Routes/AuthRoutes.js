const express = require('express');
const {
  registerUser,
  loginUser,
  forgotPassword,
  getProfile,
  logoutUser,
  updateUserInfo,
  deleteOrder,
} = require('../Controllers/AuthController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/account', getProfile);
router.put('/update-info', updateUserInfo);
router.post('/logout', logoutUser);

module.exports = router;
