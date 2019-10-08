const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  sender: {
    type: String,
    required: true,
    trim: true
  },
  senderName: {
    type: String,
    required: true,
    trim: true
  },
  receiver: {
    type: String,
    required: true,
    trim: true
  },
  receiverName: {
    type: String,
    required: true,
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
  point: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
