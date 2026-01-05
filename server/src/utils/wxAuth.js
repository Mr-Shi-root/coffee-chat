const https = require('https');
const config = require('../config');

// Get WeChat session (openid, session_key) by code
const getWxSession = (code) => {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.wxAppId}&secret=${config.wxAppSecret}&js_code=${code}&grant_type=authorization_code`;

    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.errcode) {
              reject(new Error(result.errmsg));
            } else {
              resolve(result);
            }
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
};

module.exports = {
  getWxSession,
};
