'use strict';

var superagent = require('superagent');

module.exports = function (_ref) {
  var config = _ref.config,
      access_token = _ref.access_token;
  return new Promise(function (resolve, reject) {
    superagent.get(config.url.ticket).query({
      type: 'jsapi',
      access_token: access_token
    }).accept('application/json').end(function (err, s_res) {
      if (err) {
        reject(err);
      }

      resolve(JSON.parse(s_res.text).ticket);
    });
  });
};