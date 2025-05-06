const express = require('express');
const AddressMiddleWare = require('../Helpers-Middlewares/AddressMiddleWare');
const {
  deleteAddress,
  makeDefaultAddress,
  addAddress,
} = require('../Controllers/AddressController');

const router = express.Router();

router.delete('/delete-address', AddressMiddleWare, deleteAddress);
router.put('/make-default-address', AddressMiddleWare, makeDefaultAddress);
router.post('/add-address', AddressMiddleWare, addAddress);

module.exports = router;
