const Transaction = require('../model/mTransaksi');
const Nasabah = require('../model/mNasabah');


exports.transfer = (req, res, next) => {
  let sender;
  let receiver;
  let pointSender = 0;
  let pointReceiver = 0;

  Nasabah.findOne({
    norek: req.body.sender
  }).then(nasabahNasabah => {
    if (!nasabahNasabah) {
      return res.status(401).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Account Not Fund!'
      });
    }
    sender = nasabahNasabah;
    if (sender.norek == req.body.receiver) {
      return res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Tujuan tidak valid!'
      });
    } else if (sender.status != 1) {
      return res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Rekening Tidak Valid!'
      });
    } else if (sender.balance < req.body.amount) {
      return res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Balance Tidak Cukup!'
      });
    } else if (req.body.pin != sender.pin) {
      return res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'PIN Tidak Valid!'
      });
    } else if (req.body.amount < 20000) {
      return res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Min Transfer 20.000!'
      });
    } else {
      Nasabah.findOne({
        norek: req.body.receiver
      }).then(receiverNasabah => {
        if (!receiverNasabah) {
          return res.status(400).json({
            responseCode: '11',
            responseDesc: 'Invalid!',
            message: 'Receiver Not Fund!'
          });
        }
        receiver = receiverNasabah;
        if (receiver.status != 1) {
          return res.status(400).json({
            responseCode: '11',
            responseDesc: 'Invalid!',
            message: 'Receiver Tidak Valid!'
          });
        } else {

          //config point
          let amount = req.body.amount;
          if ((amount >= 500000) && (amount <= 2000000)) {
            pointSender = -1;
            pointReceiver = 1;
          } else if ((amount >= 2000000) && (amount <= 5000000)) {
            pointSender = -2;
            pointReceiver = 2;
          } else if (amount >= 10000000) {
            pointSender = -3;
            pointReceiver = 3;
          } else {
            pointSender = 0;
            pointReceiver = 0;
          }

          //config transfer sender
          const transferSender = new Transaction({
            sender: req.body.sender,
            senderName: sender.name,
            receiver: req.body.receiver,
            receiverName: receiver.name,
            amount: req.body.amount,
            type: 'D',
            point: pointSender,
            description: req.body.description
          });
          transferSender.save().then(result => {
            //config transfer receiver
            const transferReceiver = new Transaction({
              sender: req.body.sender,
              senderName: sender.name,
              receiver: req.body.receiver,
              receiverName: receiver.name,
              amount: req.body.amount,
              type: 'C',
              point: pointReceiver,
              description: req.body.description
            });
            transferReceiver.save().then(resultReceiver => {
              let totalPointSender = 0;
              if ((sender.totalPoint + pointSender) < 0) {
                totalPointSender = 0;
              } else if ((sender.totalPoint + pointSender) > 0) {
                totalPointSender = (sender.totalPoint + pointSender);
              }

              console.log(totalPointSender);

              const updateSender = {
                balance: sender.balance - req.body.amount,
                totalPoint: totalPointSender
              }
              Nasabah.updateOne({
                _id: sender._id
              }, updateSender).then(resUpdateSender => {
                const updateReceiver = {
                  balance: receiver.balance + req.body.amount,
                  totalPoint: receiver.totalPoint + pointReceiver
                }
                Nasabah.updateOne({
                  _id: receiver._id
                }, updateReceiver).then(resUpdateReceiver => {
                  console.log('sukses transfer!')
                })
              });
            });
          }).catch(err => {
            return res.status(500).json({
              responseCode: '11',
              responseDesc: 'Invalid!',
              message: err.message
            });
          });
          return res.status(200).json({
            responseCode: '00',
            responseDesc: 'Success!',
            message: 'Transfer sedang dalam Proses!'
          });
        }
      })

    }
  }).catch(err => {
    return res.status(500).json({
      responseCode: '11',
      responseDesc: 'Invalid!',
      message: err.message
    });
  })
}

//calculate point transaction
exports.transferIn = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const norek = req.query.norek;
  const transactionQuery = Transaction.find({
    receiver: norek,
    type: 'C'
  }).sort({
    createdAt: -1
  });
  let fetchHistory;
  if (pageSize && currentPage) {
    transactionQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  transactionQuery.then(documents => {
    fetchHistory = documents;
    return transactionQuery.countDocuments({
      receiver: norek,
      type: 'C'
    });
  }).then(count => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: fetchHistory,
      maxInHistory: count
    });
  }).catch(err => {
    res.status(500).json({
      responseCode: '11',
      responseDesc: 'Error!',
      message: err
    });
  })
}

exports.transferInCount = async (req, res, next) => {
  try {
    await Transaction.find({
      receiver: req.params.norek,
      type: 'C'
    }).count().then(data => {
      return res.status(200).json({
        responseCode: '00',
        responseDesc: 'Success!',
        message: data
      });
    });
  } catch (e) {
    return res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err.message
    });
  }
}

exports.transferInLimit = async (req, res, next) => {
  try {
    await Transaction.find({
      receiver: req.params.norek,
      type: 'C'
    }).sort({
      createdAt: -1
    }).limit(3).then(data => {
      // console.log(data);
      return res.status(200).json({
        responseCode: '00',
        responseDesc: 'Success!',
        message: data
      });
    });
  } catch (e) {
    return res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err.message
    });
  }
}

exports.transferOut = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const norek = req.query.norek;
  const transactionQuery = Transaction.find({
    sender: norek,
    type: 'D'
  }).sort({
    createdAt: -1
  });
  let fetchHistory;
  if (pageSize && currentPage) {
    transactionQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  transactionQuery.then(documents => {
    fetchHistory = documents;
    return Transaction.countDocuments({
      sender: norek,
      type: 'D'
    });
  }).then(count => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: fetchHistory,
      maxOutHistory: count
    });
  }).catch(e => {
    res.status(500).json({
      responseCode: '11',
      responseDesc: 'Error!',
      message: e.message
    });
  })
}

exports.transferOutCount = async (req, res, next) => {
  try {
    await Transaction.find({
      sender: req.params.norek,
      type: 'D'
    }).count().then(data => {
      return res.status(200).json({
        responseCode: '00',
        responseDesc: 'Success!',
        message: data
      });
    });
  } catch (e) {
    return res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err.message
    });
  }
}

exports.transferOutLimit = async (req, res, next) => {
  try {
    await Transaction.find({
      sender: req.params.norek,
      type: 'D'
    }).sort({
      createdAt: -1
    }).limit(3).then(data => {
      return res.status(200).json({
        responseCode: '00',
        responseDesc: 'Success!',
        message: data
      });
    });
  } catch (e) {
    return res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err.message
    });
  }
}

//getPointBulananByNorek
exports.getPointBulananByNorek = (req, res, next) => {
  const date = new Date();
  const month = date.getMonth();
  const month2 = date.getMonth() + 1;
  const year = date.getFullYear();


}
