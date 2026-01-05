const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // 主题设置
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
    },
    // 通知设置
    notification: {
      type: Boolean,
      default: true,
    },
    // 语言设置
    language: {
      type: String,
      enum: ['zh-CN', 'en-US'],
      default: 'zh-CN',
    },
    // 字体大小
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
