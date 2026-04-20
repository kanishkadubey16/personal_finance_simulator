const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  income: {
    type: Number,
    required: true,
    default: 0
  },
  baseMonthlyExpenses: {
    type: Number,
    required: true,
    default: 0
  },
  savings: {
    type: Number,
    required: true,
    default: 0
  },
  investments: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
