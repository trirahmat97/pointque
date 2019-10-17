const express = require('express');
const router = express.Router();

const controllerNasabahOther = require('../controller/cNasabahOther');

router.post('', controllerNasabahOther.createNasabah);
router.get('/getNasabah/:norek', controllerNasabahOther.getNasabah);
module.exports = router;
