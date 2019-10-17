const express = require('express');
const router = express.Router();

const controlerTransaction = require('../controller/cTransactionOther');

router.post('', controlerTransaction.transfer);
router.post('/in', controlerTransaction.transferIn);

module.exports = router;
