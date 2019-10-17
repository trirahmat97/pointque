const express = require('express');
const router = express.Router();


const controlerConfigReward = require('../controller/cConfigReward');

router.post('/add', controlerConfigReward.createConfigReward);
router.get('/list', controlerConfigReward.listConfigReward);

module.exports = router;
