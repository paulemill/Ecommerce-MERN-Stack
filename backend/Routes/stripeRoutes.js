const express = require('express');
const { createCheckoutSession } = require('../Controllers/stripeController');

const router = express.Router();

router.post('/checkout', createCheckoutSession);

module.exports = router;
