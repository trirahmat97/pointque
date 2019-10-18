const Nasabah = require('../model/mNasabah');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//add
exports.createNasabah = (req, res, next) => {
  const body = req.body;
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const nasabah = new Nasabah({
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

//norek and pin
exports.getNasabahNorekPin = (req, res, next) => {
  Nasabah.find({
    norek: req.body.norek,
    pin: req.body.pin
  }).then(nasabah => {
    if (nasabah) {
      if (nasabah.length == 1) {
        return res.status(200).json({
          responseCode: '00',
          responseDesc: 'Success!',
          message: nasabah
        });
      } else {
        return res.status(400).json({
          responseCode: '11',
          responseDesc: 'Invalid!',
          message: 'Invalid PIN'
        });
      }
    } else {
      res.status(404).json({
        responseCode: '04',
        responseDesc: 'No Foud!',
        message: 'Data note fund'
      });
    }
  }).catch(err => {
    res.status(500).json({
      responseCode: '11',
      responseDesc: 'Invailid!',
      message: 'Fetching posts failed!'
    })
  })
}

//inquiry
exports.getNasabah = (req, res, next) => {
  Nasabah.findOne({
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
        responseCode: '04',
        responseDesc: 'No Foud!',
        message: 'Data note fund'
      });
    }
  }).catch(err => {
    res.status(500).json({
      responseCode: '11',
      responseDesc: 'Invailid!',
      message: 'Fetching posts failed!'
    })
  })
}

//inquiry
exports.getNasabahUserId = (req, res, next) => {
  Nasabah.findById(req.params.id)
    .then(nasabah => {
      if (nasabah) {
        return res.status(200).json({
          responseCode: '00',
          responseDesc: 'Success!',
          message: nasabah
        });
      }
      res.status(404).json({
        responseCode: '04',
        responseDesc: 'No Foud!',
        message: 'Data note fund'
      });

    }).catch(err => {
      res.status(500).json({
        responseCode: '11',
        responseDesc: 'Invailid!',
        message: 'Fetching posts failed!'
      })
    })
}

exports.loginNasabah = (req, res, next) => {
  let fetchNasabah;
  Nasabah.findOne({
    email: req.body.email
  }).then(nasabah => {
    if (!nasabah) {
      return res.status(401).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Invalid email or password!'
      });
    }
    fetchNasabah = nasabah;
    return bcrypt.compare(req.body.password, nasabah.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Invalid email or password!'
      });
    }
    const token = jwt.sign({
      email: fetchNasabah.email,
      userId: fetchNasabah._id
    }, process.env.JWT_KEY, {
      expiresIn: '1h'
    });

    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: {
        token,
        expiredIn: 3600,
        userId: fetchNasabah._id,
        level: fetchNasabah.level,
        status: fetchNasabah.status
      }
    });
  }).catch(err => {
    return res.status(401).json({
      responseCode: '11',
      responseDesc: 'Invalid!',
      message: err.message
    });
  })
}

//list nasabah
exports.listNasabah = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const data = new Date();
  const nasabahQuery = Nasabah.find({
    level: '2'
  });
  let fetchNasabah;
  if (pageSize && currentPage) {
    nasabahQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  nasabahQuery.then(documents => {
    fetchNasabah = documents;
    return Nasabah.count({
      level: '2'
    });
  }).then(count => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: fetchNasabah,
      maxNasabah: count
    });
  }).catch(e => {
    res.status(500).json({
      responseCode: '11',
      responseDesc: 'Error!',
      message: e.message
    })
  });
}
//update status
exports.updateStatusNasabah = (req, res, next) => {
  const nasabah = {
    status: req.body.status
  }
  console.log(req.body);
  Nasabah.updateOne({
    norek: req.body.norek
  }, nasabah).then(result => {
    console.log(result);
    if (result.n > 0) {
      return res.status(200).json({
        responseCode: '00',
        responseDesc: 'Success!',
        message: 'Success Update!'
      });
    } else {
      return res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Not Authorization!'
      });
    }
  }).catch(e => {
    res.status(500).json({
      responseCode: '55',
      responseDesc: 'Error!',
      message: e.message
    })
  })
}

exports.grafikNasabah = (req, res, next) => {
  res.status(200).json({
    responseCode: '00',
    responseDesc: 'Success!',
    message: [{
        player: 'aa',
        run: 1000
      },
      {
        player: 'bb',
        run: 15
      },
      {
        player: 'cc',
        run: 200
      }
    ]
  })
}

//max point limit 3
exports.getMaxNasabah = (req, res, next) => {
  Nasabah.find({
    level: '2',
  }).sort({
    "totalPoint": -1
  }).limit(5).then(nasabah => {
    if (nasabah) {
      const date = new Date(nasabah.createdAt);
      return res.status(200).json({
        responseCode: '00',
        responseDesc: 'Success!',
        message: nasabah
      });
    } else {
      res.status(404).json({
        responseCode: '04',
        responseDesc: 'No Foud!',
        message: 'Data note fund'
      });
    }
  }).catch(err => {
    res.status(500).json({
      responseCode: '11',
      responseDesc: 'Invailid!',
      message: 'Fetching posts failed!'
    })
  })
}
