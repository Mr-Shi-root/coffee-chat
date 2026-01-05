const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    openid: {
      type: String,
      required: true,
      unique: true,
    },
    nickname: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    gender: {
      type: Number,
      enum: [0, 1, 2], // 0: unknown, 1: male, 2: female
      default: 0,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0: disabled, 1: active
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
