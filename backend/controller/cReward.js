const Reward = require('../model/mReward');
const Transaction = require('../model/mTransaksi');
const Nasabah = require('../model/mNasabah');
const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const date = new Date();
const date2 = new Date(new Date(date).setMonth(date.getMonth() + 1));
let getMonth1 = date.getFullYear() + "-" + month[date.getMonth()];
let getMonth2 = date.getFullYear() + "-" + month[date2.getMonth()];

exports.send = (req, res, next) => {
  const body = req.body;
  let receiver;
  Nasabah.findOne({
    norek: req.body.norek
  }).then(receiverNasabah => {
    if (!receiverNasabah) {
      return res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Receiver Not Fund!'
      });
    }
    receiver = receiverNasabah;
    const configReward = new Reward({
      norek: body.norek,
      name: receiver.name,
      hadiah: body.hadiah,
      point: body.point,
      type: body.type
    });
    configReward.save().then(result => {
      const transferReceiver = new Transaction({
        sender: 'pointKuy!',
        senderName: 'pointKuy!',
        receiver: req.body.norek,
        receiverName: receiver.name,
        amount: req.body.hadiah,
        type: 'C',
        point: '0',
        senderBank: 'pointKuy!',
        description: 'Reward'
      });
      transferReceiver.save().then(result2 => {
        const updateReceiver = {
          balance: receiver.balance + req.body.hadiah
        }
        Nasabah.updateOne({
          _id: receiver._id
        }, updateReceiver).then(resUpdateReceiver => {
          res.status(200).json({
            responseCode: '00',
            responseDesc: 'Success!',
            message: `Sukses Reward to ${receiver.name}`
          });
        })
      })
    }).catch(err => {
      res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid',
        message: err.message
      });
    })
  }).catch(er => {
    res.status(500).json({
      responseCode: '55',
      responseDesc: 'Error!',
      message: er.message
    });
  })
}

exports.listBulan = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const rewardQuery = Reward.find({
    createdAt: {
      "$lt": new Date(getMonth2),
      "$gte": new Date(getMonth1),
    }
  });
  let rewardData;
  if (pageSize && currentPage) {
    rewardQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  rewardQuery.then(documents => {
    rewardData = documents;
    return Reward.countDocuments({});
  }).then(count => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: rewardData,
      maxReward: count
    });
  }).catch(e => {
    res.status(500).json({
      responseCode: '11',
      responseDesc: 'Error!',
      message: e.message
    })
  });
}
