const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  clearCart,
  storeOrder,
} = require('../Controllers/CartControllers');
const router = express.Router();

const requireAuthForCart = require('../Helpers-Middlewares/requireAuthForCart');

router.get('/', requireAuthForCart, getCart);
router.post('/add', requireAuthForCart, addToCart);
router.delete('/remove', requireAuthForCart, removeFromCart);
router.put('/update', requireAuthForCart, updateCart);
router.delete('/clear', requireAuthForCart, clearCart);
router.post('/orders', requireAuthForCart, storeOrder);

module.exports = router;

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
