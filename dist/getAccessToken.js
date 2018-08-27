'use strict';

var superagent = require('superagent');

module.exports = function (_ref) {
  var config = _ref.config,
      wxConfig = _ref.wxConfig;
  return new Promise(function (resolve, reject) {
    superagent.get(config.url.token).query({
      grant_type: config.grant_type,
      appid: wxConfig.appid,
      secret: wxConfig.secret
    }).accept('application/json').end(function (err, s_res) {
      if (err) {
        reject(err);
      }

      resolve(JSON.parse(s_res.text).access_token);
    });
  });
};