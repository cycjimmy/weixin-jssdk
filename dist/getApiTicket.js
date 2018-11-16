"use strict";

const superagent = require('superagent');

module.exports = ({
  config,
  access_token
}) => new Promise(resolve => {
  superagent.get(config.url.ticket).query({
    type: 'jsapi',
    access_token: access_token
  }).set('accept', 'json').end((err, s_res) => {
    if (err) {
      resolve();
    } else {
      const ticket = JSON.parse(s_res.text).ticket;
      ticket ? resolve(ticket) : resolve();
    }
  });
});