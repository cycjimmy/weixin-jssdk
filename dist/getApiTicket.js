'use strict';

var superagent = require('superagent');

module.exports = function (_ref) {
  var config = _ref.config,
      access_token = _ref.access_token;
  return new Promise(function (resolve) {
    superagent.get(config.url.ticket).query({
      type: 'jsapi',
      access_token: access_token
    }).set('accept', 'json').end(function (err, s_res) {
      if (err) {
        resolve();
      } else {
        var ticket = JSON.parse(s_res.text).ticket;
        ticket ? resolve(ticket) : resolve();
      }
    });
  });
};