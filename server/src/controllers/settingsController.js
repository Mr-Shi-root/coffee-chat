const Settings = require('../models/Settings');
const { success, fail } = require('../utils/response');

// 获取用户设置
const getSettings = async (ctx) => {
  try {
    const userId = ctx.state.user.userId;

    // 查找设置，如果不存在则创建默认设置
    let settings = await Settings.findOne({ userId });

    if (!settings) {
      settings = await Settings.create({ userId });
    }

    success(ctx, {
      theme: settings.theme,
      notification: settings.notification,
      language: settings.language,
      fontSize: settings.fontSize,
    });
  } catch (err) {
    fail(ctx, err.message);
  }
};

// 更新用户设置
const updateSettings = async (ctx) => {
  try {
    const userId = ctx.state.user.userId;
    const { theme, notification, language, fontSize } = ctx.request.body;

    // 构建更新对象，只更新传入的字段
    const updateData = {};
    if (theme !== undefined) updateData.theme = theme;
    if (notification !== undefined) updateData.notification = notification;
    if (language !== undefined) updateData.language = language;
    if (fontSize !== undefined) updateData.fontSize = fontSize;

    // 查找并更新，如果不存在则创建
    const settings = await Settings.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    success(ctx, {
      theme: settings.theme,
      notification: settings.notification,
      language: settings.language,
      fontSize: settings.fontSize,
    }, 'Settings updated successfully');
  } catch (err) {
    fail(ctx, err.message);
  }
};

// 重置为默认设置
const resetSettings = async (ctx) => {
  try {
    const userId = ctx.state.user.userId;

    const settings = await Settings.findOneAndUpdate(
      { userId },
      {
        $set: {
          theme: 'light',
          notification: true,
          language: 'zh-CN',
          fontSize: 'medium',
        },
      },
      { new: true, upsert: true }
    );

    success(ctx, {
      theme: settings.theme,
      notification: settings.notification,
      language: settings.language,
      fontSize: settings.fontSize,
    }, 'Settings reset to default');
  } catch (err) {
    fail(ctx, err.message);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
};
