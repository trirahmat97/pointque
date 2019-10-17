const mongoose = require('mongoose');
const configRewardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  jumlah: {
    type: String,
    required: true,
    trim: true
  },
  point: {
    type: String,
    required: true,
    trim: true
  },
  hadiah: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "1"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ConfigReward', configRewardSchema);
