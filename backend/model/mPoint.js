const mongoose = require('mongoose');

const pointSchema = mongoose.Schema({
  delimiter: {
    type: Number,
    required: true,
  },
  totalPoint: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Point', pointSchema);
