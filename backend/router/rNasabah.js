const express = require('express');
const router = express.Router();

const controllerNasabah = require('../controller/cNasabah');

router.post('', controllerNasabah.createNasabah);
router.post('/check', controllerNasabah.getNasabahNorekPin);
router.get('/getNasabah/:norek', controllerNasabah.getNasabah);
router.get('/user/:id', controllerNasabah.getNasabahUserId);
router.get('', controllerNasabah.listNasabah);
router.put('/status', controllerNasabah.updateStatusNasabah);
router.get('/grafik', controllerNasabah.grafikNasabah);
router.get('/maxNasabah', controllerNasabah.getMaxNasabah)

router.post('/login', controllerNasabah.loginNasabah);

module.exports = router;
