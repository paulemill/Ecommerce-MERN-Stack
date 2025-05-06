const express = require('express');
const { getProductByID } = require('../Controllers/productByIDController');

const router = express.Router();

router.get('/products/:id', getProductByID);

module.exports = router;
