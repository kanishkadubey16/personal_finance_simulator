const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String, // e.g. Car, Trip, Laptop
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  currentSavedAmount: {
    type: Number,
    default: 0,
  },
  targetDate: {
    type: Date, // Optional target date
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
