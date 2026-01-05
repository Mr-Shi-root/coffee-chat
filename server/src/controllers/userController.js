const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { success, fail } = require('../utils/response');
const { getWxSession } = require('../utils/wxAuth');

// WeChat login
const wxLogin = async (ctx) => {
  const { code } = ctx.request.body;

  if (!code) {
    return fail(ctx, 'Code is required');
  }

  try {
    // Get openid from WeChat
    const wxSession = await getWxSession(code);
    const { openid } = wxSession;

    // Find or create user
    let user = await User.findOne({ openid });
    if (!user) {
      user = await User.create({ openid });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, openid },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    success(ctx, {
      token,
      userInfo: {
        id: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    fail(ctx, err.message);
  }
};

// Get user info
const getUserInfo = async (ctx) => {
  try {
    const user = await User.findById(ctx.state.user.userId);
    if (!user) {
      return fail(ctx, 'User not found');
    }
    success(ctx, {
      id: user._id,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      gender: user.gender,
    });
  } catch (err) {
    fail(ctx, err.message);
  }
};

// Update user info
const updateUserInfo = async (ctx) => {
  const { nickname, avatar, gender } = ctx.request.body;

  try {
    const user = await User.findByIdAndUpdate(
      ctx.state.user.userId,
      { nickname, avatar, gender },
      { new: true }
    );

    if (!user) {
      return fail(ctx, 'User not found');
    }

    success(ctx, {
      id: user._id,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
    });
  } catch (err) {
    fail(ctx, err.message);
  }
};

module.exports = {
  wxLogin,
  getUserInfo,
  updateUserInfo,
};
