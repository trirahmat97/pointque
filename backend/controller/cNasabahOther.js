const NasabahOther = require('../model/mNasabahOther');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//add
exports.createNasabah = (req, res, next) => {
  const body = req.body;
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const nasabah = new NasabahOther({
        email: body.email,
        password: hash,
        nik: body.nik,
        name: body.name,
        address: body.address,
        gender: body.gender,
        phone: body.phone,
        norek: Math.floor(100000000 + Math.random() * 900000000),
        level: req.body.level
      });
      nasabah.save().then(result => {
        res.status(201).json({
          responseCode: '00',
          responseDesc: 'Success',
          message: result
        });
      }).catch(err => {
        res.status(500).json({
          responseCode: '11',
          responseDesc: 'Invalid',
          message: err.message
        });
      });
    });
}

//inquiry
exports.getNasabah = (req, res, next) => {
  NasabahOther.findOne({
    norek: req.params.norek
  }).then(nasabah => {
    if (nasabah) {
      return res.status(200).json({
        responseCode: '00',
        responseDesc: 'Success!',
        message: nasabah
      });
    } else {
      res.status(404).json({
        responseCode: '11',
        responseDesc: 'No Foud!',
        message: 'Data note fund!'
      });
    }
  }).catch(err => {
    res.status(500).json({
      responseCode: '55',
      responseDesc: 'Invailid!',
      message: 'Fetching posts failed!'
    })
  })
}
