const Transaction = require('../model/mTransaksi');
const Nasabah = require('../model/mNasabah');
const ConfigReward = require('../model/mConfigReward');

//add
exports.createConfigReward = async (req, res, next) => {
  try {
    const body = req.body;
    const configReward = await new ConfigReward({
      name: body.name,
      jumlah: body.jumlah,
      point: body.point,
      hadiah: body.hadiah,
      type: body.type
    });
    configReward.save().then(result => {
      res.status(201).json({
        responseCode: '00',
        responseDesc: 'Success',
        message: result
      });
    }).catch(err => {
      res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid',
        message: err.message
      });
    })
  } catch (err) {
    res.status(500).json({
      responseCode: '11',
      responseDesc: 'Invalid',
      message: err.message
    });
  }
}

//list nasabah
exports.listConfigReward = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const configRewardQuery = ConfigReward.find({});
  let fetchConfigReward;
  if (pageSize && currentPage) {
    configRewardQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  configRewardQuery.then(documents => {
    fetchConfigReward = documents;
    return ConfigReward.countDocuments({});
  }).then(count => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: fetchConfigReward,
      maxConfigReward: count
    });
  }).catch(e => {
    res.status(500).json({
      responseCode: '11',
      responseDesc: 'Error!',
      message: e.message
    })
  });
}
