// Unified response format
const success = (ctx, data = null, message = 'Success') => {
  ctx.body = {
    code: 0,
    message,
    data,
  };
};

const fail = (ctx, message = 'Error', code = -1) => {
  ctx.body = {
    code,
    message,
    data: null,
  };
};

module.exports = {
  success,
  fail,
};
