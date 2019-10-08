const express = require('express');
const router = express.Router();

const authNasabah = require('../midleware/mdwNasabah');
const controlerTransaction = require('../controller/cTransaction');

router.post('', authNasabah, controlerTransaction.transfer);
router.get('/in', authNasabah, controlerTransaction.transferIn);
router.get('/in/count/:norek', authNasabah, controlerTransaction.transferInCount);
router.get('/in/limit/:norek', authNasabah, controlerTransaction.transferInLimit);
router.get('/out', authNasabah, controlerTransaction.transferOut);
router.get('/out/count/:norek', authNasabah, controlerTransaction.transferOutCount);
router.get('/out/limit/:norek', authNasabah, controlerTransaction.transferOutLimit);


module.exports = router;
