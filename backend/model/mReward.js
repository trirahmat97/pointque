const mongoose = require('mongoose');
const rewardSchema = mongoose.Schema({
  norek: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  hadiah: {
    type: String,
    required: true,
    trim: true
  },
  point: {
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
    default: '1'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reward', rewardSchema);
