const express = require('express');
const { getAllProducts } = require('../Controllers/productsController');

const router = express.Router();

router.get('/products', getAllProducts);

module.exports = router;
