const express = require('express');
const router = express.Router();

const authNasabah = require('../midleware/mdwNasabah');
const controlerTransaction = require('../controller/cTransaction');

router.post('', authNasabah, controlerTransaction.transfer);
router.post('/tf/out', authNasabah, controlerTransaction.transfertfOut);

router.get('/in', authNasabah, controlerTransaction.transferIn);
router.get('/in/count/:norek', authNasabah, controlerTransaction.transferInCount);
router.get('/in/limit/:norek', authNasabah, controlerTransaction.transferInLimit);
router.get('/out', authNasabah, controlerTransaction.transferOut);
router.get('/out/count/:norek', authNasabah, controlerTransaction.transferOutCount);
router.get('/out/limit/:norek', authNasabah, controlerTransaction.transferOutLimit);
router.get('/in/history', authNasabah, controlerTransaction.getPointMountByNorek);
router.get('/out/history', authNasabah, controlerTransaction.getPoOuttMountByNorek);
router.get('/in/history/counts', authNasabah, controlerTransaction.getInSumPointMountByNorek);
router.get('/out/history/counts', authNasabah, controlerTransaction.getOutSumPointMountByNorek);
router.get('/in/history/all/counts', authNasabah, controlerTransaction.getInSumPointMountByAll);
router.get('/out/history/all/counts', authNasabah, controlerTransaction.getOutSumPointMountByAll);
router.post('/in/history/all/counts/define', authNasabah, controlerTransaction.getInSumPointMountByAllDefine);
router.post('/out/history/all/counts/define', authNasabah, controlerTransaction.getOutSumPointMountByAllDefine);


module.exports = router;
