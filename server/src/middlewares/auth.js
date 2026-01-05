const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async (ctx, next) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: 'No token provided',
      data: null,
    };
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: 'Invalid token',
      data: null,
    };
  }
};
