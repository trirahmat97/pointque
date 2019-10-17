const mongoose = require('mongoose');

const transactionOtherSchema = mongoose.Schema({
  sender: {
    type: String,
    required: true,
    trim: true
  },
  senderName: {
    type: String,
    // required: true,
    trim: true
  },
  receiver: {
    type: String,
    required: true,
    trim: true
  },
  receiverName: {
    type: String,
    // required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    trim: true
  },
  senderBank: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TransactionOther', transactionOtherSchema);
