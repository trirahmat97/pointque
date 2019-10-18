const Transaction = require('../model/mTransaksi');
const Nasabah = require('../model/mNasabah');

// config date
const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const date = new Date();
const date2 = new Date(new Date(date).setMonth(date.getMonth() + 1));
let getMonth1 = date.getFullYear() + "-" + month[date.getMonth()];
let getMonth2 = date.getFullYear() + "-" + month[date2.getMonth()];


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
          if ((amount >= 1000000) && (amount < 2000000)) {
            pointSender = 2;
            pointReceiver = 4;
          } else if ((amount >= 2000000) && (amount < 3000000)) {
            pointSender = 2;
            pointReceiver = 6;
          } else if ((amount >= 3000000) && (amount < 4000000)) {
            pointSender = 2;
            pointReceiver = 8;
          } else if ((amount >= 4000000) && (amount < 5000000)) {
            pointSender = 2;
            pointReceiver = 10;
          } else if ((amount >= 5000000) && (amount < 6000000)) {
            pointSender = 2;
            pointReceiver = 12;
          } else if ((amount >= 6000000) && (amount < 7000000)) {
            pointSender = 2;
            pointReceiver = 14;
          } else if ((amount >= 7000000) && (amount < 8000000)) {
            pointSender = 2;
            pointReceiver = 16;
          } else if ((amount >= 8000000) && (amount < 9000000)) {
            pointSender = 2;
            pointReceiver = 18;
          } else if ((amount >= 9000000) && (amount < 10000000)) {
            pointSender = 2;
            pointReceiver = 20;
          } else if (amount >= 10000000) {
            pointSender = 2;
            pointReceiver = 22;
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
            receiverBank: 'pointkuy!',
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
              senderBank: 'pointkuy!',
              description: req.body.description
            });
            transferReceiver.save().then(resultReceiver => {
              let totalPointSender = 0;
              if ((sender.totalPoint + pointSender) < 0) {
                totalPointSender = 0;
              } else if ((sender.totalPoint + pointSender) > 0) {
                totalPointSender = (sender.totalPoint + pointSender);
              }
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

exports.transfertfOut = (req, res, next) => {
  let sender;
  let receiver;
  let pointSender = 0;
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
      //config point

      let amount = req.body.amount;
      if ((amount >= 1000000) && (amount < 2000000)) {
        pointSender = 2;
      } else if ((amount >= 2000000) && (amount < 3000000)) {
        pointSender = 2;
      } else if ((amount >= 3000000) && (amount < 4000000)) {
        pointSender = 2;
      } else if ((amount >= 4000000) && (amount < 5000000)) {
        pointSender = 2;
      } else if ((amount >= 5000000) && (amount < 6000000)) {
        pointSender = 2;
      } else if ((amount >= 6000000) && (amount < 7000000)) {
        pointSender = 2;
      } else if ((amount >= 7000000) && (amount < 8000000)) {
        pointSender = 2;
      } else if ((amount >= 8000000) && (amount < 9000000)) {
        pointSender = 2;
      } else if ((amount >= 9000000) && (amount < 10000000)) {
        pointSender = 2;
      } else if (amount >= 10000000) {
        pointSender = 2;
      } else {
        pointSender = 0;
      }
      const transferSender = new Transaction({
        sender: req.body.sender,
        senderName: sender.name,
        receiver: req.body.receiver,
        receiverName: req.body.receiverName,
        amount: req.body.amount,
        type: 'D',
        point: pointSender,
        receiverBank: 'G-Bank',
        description: req.body.description
      });
      transferSender.save().then(result => {
        const updateSender = {
          balance: sender.balance - req.body.amount,
          totalPoint: sender.totalPoint + pointSender
        }
        Nasabah.updateOne({
          _id: sender._id
        }, updateSender).then(resUpdateSender => {
          return res.status(200).json({
            responseCode: '00',
            responseDesc: 'Success!',
            message: 'Transfer sedang dalam Proses!'
          });
        });
      }).catch(err => {
        return res.status(500).json({
          responseCode: '11',
          responseDesc: 'Invalid!',
          message: err.message
        });
      });
    }
  }).catch(err => {
    return res.status(500).json({
      responseCode: '11',
      responseDesc: 'Invalid!',
      message: err.message
    });
  })
}

exports.transfertfIn = (req, res, next) => {
  // let receiver;
  let receiver;
  let pointReceiver = 0;
  Nasabah.findOne({
    norek: req.body.receiver
  }).then(nasabahNasabah => {
    if (!nasabahNasabah) {
      return res.status(401).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Account Not Fund!'
      });
    }
    receiver = nasabahNasabah;
    if (receiver.norek != req.body.receiver) {
      return res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Tujuan tidak valid!'
      });
    } else if (receiver.status != 1) {
      return res.status(400).json({
        responseCode: '11',
        responseDesc: 'Invalid!',
        message: 'Rekening Tidak Valid!'
      });
    } else {
      //config point

      let amount = req.body.amount;
      if ((amount >= 1000000) && (amount < 2000000)) {
        pointReceiver = 4;
      } else if ((amount >= 2000000) && (amount < 3000000)) {
        pointReceiver = 8;
      } else if ((amount >= 3000000) && (amount < 4000000)) {
        pointReceiver = 12;
      } else if ((amount >= 4000000) && (amount < 5000000)) {
        pointReceiver = 16;
      } else if ((amount >= 5000000) && (amount < 6000000)) {
        pointReceiver = 20;
      } else if ((amount >= 6000000) && (amount < 7000000)) {
        pointReceiver = 22;
      } else if ((amount >= 7000000) && (amount < 8000000)) {
        pointReceiver = 24;
      } else if ((amount >= 8000000) && (amount < 9000000)) {
        pointReceiver = 26;
      } else if ((amount >= 9000000) && (amount < 10000000)) {
        pointReceiver = 28;
      } else if (amount >= 10000000) {
        pointReceiver = 30;
      } else {
        pointReceiver = 0;
      }
      const transferReceiver = new Transaction({
        sender: req.body.sender,
        senderName: req.body.senderName,
        receiver: req.body.receiver,
        receiverName: receiver.name,
        amount: req.body.amount,
        type: 'C',
        point: pointReceiver,
        senderBank: 'G-Bank',
        description: req.body.description
      });
      transferReceiver.save().then(result => {
        const updateReceiver = {
          balance: receiver.balance + req.body.amount,
          totalPoint: receiver.totalPoint + pointReceiver
        }
        Nasabah.updateOne({
          _id: receiver._id
        }, updateReceiver).then(resUpdateReceiver => {
          return res.status(200).json({
            responseCode: '00',
            responseDesc: 'Success!',
            message: 'Transfer sedang dalam Proses!'
          });
        });
      }).catch(err => {
        return res.status(500).json({
          responseCode: '11',
          responseDesc: 'Invalid!',
          message: err.message
        });
      });
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

//getPointMountByNorek
exports.getPointMountByNorek = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const norek = req.query.norek;
  try {
    const transactionQuery = Transaction.find({
      sender: norek,
      createdAt: {
        "$lt": new Date(getMonth2),
        "$gte": new Date(getMonth1),
      },
      type: "D"
    }).sort({
      createdAt: -1
    });
    let fetchHistory;
    if (pageSize && currentPage) {
      transactionQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    transactionQuery.then(documents => {
      fetchHistory = documents;
      return transactionQuery.countDocuments({});
    }).then(count => {
      res.status(200).json({
        responseCode: '00',
        responseDesc: 'Success!',
        message: fetchHistory,
        maxInHistory: count
      });
    });
  } catch (err) {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err.message
    });
  }
}

//getPoOuttMountByNorek
exports.getPoOuttMountByNorek = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const norek = req.query.norek;
  try {
    const transactionQuery = Transaction.find({
      receiver: norek,
      createdAt: {
        "$lt": new Date(getMonth2),
        "$gte": new Date(getMonth1),
      },
      type: "C"
    }).sort({
      createdAt: -1
    });
    let fetchHistory;
    if (pageSize && currentPage) {
      transactionQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    transactionQuery.then(documents => {
      fetchHistory = documents;
      return transactionQuery.countDocuments({});
    }).then(count => {
      res.status(200).json({
        responseCode: '00',
        responseDesc: 'Success!',
        message: fetchHistory,
        maxInHistory: count
      });
    });
  } catch (err) {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err.message
    });
  }
}

//getInSumPointMountByNorek
exports.getInSumPointMountByNorek = (req, res, next) => {
  const norek = req.query.norek;
  Transaction.aggregate([{
      $match: {
        receiver: norek,
        type: "C"
      }
    },
    {
      $group: {
        _id: null,
        point: {
          $sum: "$point"
        }
      }
    }
  ]).then(result => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: result
    });
  }).catch(err => {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err
    });
  })
}

//getOutSumPointMountByNorek
exports.getOutSumPointMountByNorek = (req, res, next) => {
  const norek = req.query.norek;
  Transaction.aggregate([{
      $match: {
        sender: norek,
        type: "D"
      }
    },
    {
      $group: {
        _id: null,
        point: {
          $sum: "$point"
        }
      }
    }
  ]).then(result => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: result
    });
  }).catch(err => {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err.message
    });
  })
}

//getInSumPointMountByAll
exports.getInSumPointMountByAll = (req, res, next) => {
  Transaction.aggregate([{
      $lookup: {
        from: "nasabahs",
        localField: "receiver",
        foreignField: "norek",
        as: "data"
      }
    },
    {
      $match: {
        type: "C",
        createdAt: {
          "$lt": new Date(getMonth2),
          "$gte": new Date(getMonth1),
        }
      }
    },
    {
      $group: {
        _id: {
          _id: "$receiver",
          name: '$data.name',
        },
        point: {
          $sum: "$point"
        }
      }
    }
  ]).then(result => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: result
    });
  }).catch(err => {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err
    });
  })
}

//getOutSumPointMountByAll
exports.getOutSumPointMountByAll = (req, res, next) => {
  Transaction.aggregate([{
      $lookup: {
        from: "nasabahs",
        localField: "sender",
        foreignField: "norek",
        as: "data"
      }
    }, {
      $match: {
        type: "D",
        createdAt: {
          "$lt": new Date(getMonth2),
          "$gte": new Date(getMonth1),
        }
      }
    },
    {
      $group: {
        _id: {
          _id: "$sender",
          name: '$data.name',
        },
        point: {
          $sum: "$point"
        }
      }
    }
  ]).then(result => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: result
    });
  }).catch(err => {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err
    });
  })
}

//getOutSumPointMountByAll
exports.getOutSumPointMountByAll2 = (req, res, next) => {
  Transaction.aggregate([{
      $match: {
        type: "D",
        createdAt: {
          "$lt": new Date(getMonth2),
          "$gte": new Date(getMonth1),
        }
      }
    },
    {
      $group: {
        _id: "$sender",
        point: {
          $sum: "$point"
        }
      }
    }
  ]).then(result => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: result
    });
  }).catch(err => {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err
    });
  })
}

//getInSumPointMountByAll
exports.getInSumPointMountByAll2 = (req, res, next) => {
  Transaction.aggregate([{
      $match: {
        type: "C",
        createdAt: {
          "$lt": new Date(getMonth2),
          "$gte": new Date(getMonth1),
        }
      }
    },
    {
      $group: {
        _id: "$receiver",
        point: {
          $sum: "$point"
        }
      }
    }
  ]).then(result => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: result
    });
  }).catch(err => {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err
    });
  })
}


//define
//getInSumPointMountByAllDefine
exports.getInSumPointMountByAllDefine = (req, res, next) => {
  const dateInput = new Date(req.body.date);
  const date2input = new Date(new Date(dateInput).setMonth(dateInput.getMonth() + 1));
  let getMonth1Input = dateInput.getFullYear() + "-" + month[dateInput.getMonth()];
  let getMonth2Input = dateInput.getFullYear() + "-" + month[date2input.getMonth()];
  Transaction.aggregate([{
      $lookup: {
        from: "nasabahs",
        localField: "receiver",
        foreignField: "norek",
        as: "data"
      }
    },
    {
      $match: {
        type: "C",
        createdAt: {
          "$lt": new Date(getMonth2Input),
          "$gte": new Date(getMonth1Input),
        }
      }
    },
    {
      $group: {
        _id: {
          _id: "$receiver",
          name: '$data.name',
        },
        point: {
          $sum: "$point"
        }
      }
    }
  ]).then(result => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: result
    });
  }).catch(err => {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err
    });
  })
}

//getOutSumPointMountByAll
exports.getOutSumPointMountByAllDefine = (req, res, next) => {
  const dateInput = new Date(req.body.date);
  const date2input = new Date(new Date(dateInput).setMonth(dateInput.getMonth() + 1));
  let getMonth1Input = dateInput.getFullYear() + "-" + month[dateInput.getMonth()];
  let getMonth2Input = dateInput.getFullYear() + "-" + month[date2input.getMonth()];
  Transaction.aggregate([{
      $lookup: {
        from: "nasabahs",
        localField: "sender",
        foreignField: "norek",
        as: "data"
      }
    }, {
      $match: {
        type: "D",
        createdAt: {
          "$lt": new Date(getMonth2Input),
          "$gte": new Date(getMonth1Input),
        }
      }
    },
    {
      $group: {
        _id: {
          _id: "$sender",
          name: '$data.name',
        },
        point: {
          $sum: "$point"
        }
      }
    }
  ]).then(result => {
    res.status(200).json({
      responseCode: '00',
      responseDesc: 'Success!',
      message: result
    });
  }).catch(err => {
    res.status(500).json({
      responseCode: '50',
      responseDesc: 'Error!',
      message: err
    });
  })
}
