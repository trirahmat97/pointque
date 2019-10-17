const mongoose = require('mongoose');
const validator = require('validator');

const nasabahSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('email is inVailid!');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "Password"');
      }
    }
  },
  nik: {
    type: String,
    required: true,
    trim: true,
    minlength: 16,
    maxlength: 16,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  norek: {
    type: String,
    required: true,
    trim: true
  },
  pin: {
    type: String,
    trim: true,
    default: '123456'
  },
  balance: {
    type: Number,
    default: 0
  },
  totalPoint: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: '2'
  },
  level: {
    type: String,
    default: 2,
    required: true
  },
  codeBank: {
    type: String,
    default: '123'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Nasabah', nasabahSchema);
