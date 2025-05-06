const express = require('express');
const router = express.Router();
const OrderHistoryMiddleware = require('../Helpers-Middlewares/OrderHistoryMiddleware');

const { deleteOrder } = require('../Controllers/OrderHistoryController');

router.delete('/delete-order', OrderHistoryMiddleware, deleteOrder);

module.exports = router;
