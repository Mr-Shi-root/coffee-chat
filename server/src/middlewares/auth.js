const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;
  console.log('[Auth] Authorization header:', authHeader ? 'present' : 'missing');

  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    console.log('[Auth] No token provided');
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
    console.log('[Auth] Token verified, userId:', decoded.userId);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    console.log('[Auth] Token verification failed:', err.message);
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: 'Invalid token',
      data: null,
    };
  }
};
