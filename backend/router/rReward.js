const express = require('express');
const router = express.Router();


const controlerReward = require('../controller/cReward');

router.post('/send', controlerReward.send);
router.get('/list', controlerReward.listBulan);

module.exports = router;
