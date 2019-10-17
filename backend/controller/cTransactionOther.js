const TransactionOther = require('../model/mTransaksiOther');
const NasabahOther = require('../model/mNasabahOther');

exports.transfer = (req, res, next) => {
  let sender;
  let receiver;

  NasabahOther.findOne({
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
      NasabahOther.findOne({
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
          //config transfer sender
          const transferSender = new TransactionOther({
            sender: req.body.sender,
            senderName: sender.name,
            receiver: req.body.receiver,
            receiverName: receiver.name,
            amount: req.body.amount,
            type: 'D',
            description: req.body.description
          });
          transferSender.save().then(result => {
            //config transfer receiver
            const transferReceiver = new TransactionOther({
              sender: req.body.sender,
              senderName: sender.name,
              receiver: req.body.receiver,
              receiverName: receiver.name,
              amount: req.body.amount,
              type: 'C',
              description: req.body.description
            });
            transferReceiver.save().then(resultReceiver => {
              const updateSender = {
                balance: sender.balance - req.body.amount,
              }
              NasabahOther.updateOne({
                _id: sender._id
              }, updateSender).then(resUpdateSender => {
                const updateReceiver = {
                  balance: receiver.balance + req.body.amount,
                }
                NasabahOther.updateOne({
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

//transfer other
exports.transferIn = (req, res, next) => {
  // console.log('haha');
  let receiver;
  NasabahOther.findOne({
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
      const transferReceiver = new TransactionOther({
        sender: req.body.sender,
        senderName: req.body.senderName,
        receiver: req.body.receiver,
        amount: req.body.amount,
        type: 'C',
        senderBank: 'pointque',
        description: req.body.description
      });
      transferReceiver.save().then(resDataRec => {
        const updateReceiver = {
          balance: receiver.balance + req.body.amount,
        }
        NasabahOther.updateOne({
          _id: receiver._id
        }, updateReceiver).then(resUpdateReceiver => {
          res.status(200).json({
            responseCode: '00',
            responseDesc: 'Success!',
            message: `Berhasil Kirim Ke : ${receiver.name}`
          })
        })
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
