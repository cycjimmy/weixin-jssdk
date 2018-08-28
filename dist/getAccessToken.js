'use strict';

var superagent = require('superagent');

module.exports = function (_ref) {
  var config = _ref.config,
      wxConfig = _ref.wxConfig;
  return new Promise(function (resolve) {
    superagent.get(config.url.token).query({
      grant_type: config.grant_type,
      appid: wxConfig.appid,
      secret: wxConfig.secret
    }).set('accept', 'json').end(function (err, s_res) {
      if (err) {
        resolve();
      } else {
        var access_token = JSON.parse(s_res.text).access_token;

        access_token ? resolve(access_token) : resolve();
      }
    });
  });
};