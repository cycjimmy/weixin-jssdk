'use strict';

var crypto = require('crypto');

var createNonceStr = function createNonceStr() {
  return Math.random().toString(36).substr(2, 15);
},
    createTimestamp = function createTimestamp() {
  return parseInt(new Date().getTime() / 1000) + '';
},
    raw = function raw(args) {
  var keys = Object.keys(args),
      newArgs = {},
      string = '';
  keys = keys.sort();

  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  for (var k in newArgs) {
    if (newArgs.hasOwnProperty(k)) {
      string += '&' + k + '=' + newArgs[k];
    }
  }
  string = string.substr(1);
  return string;
},
    sha1 = function sha1(str) {
  var shasum = crypto.createHash('sha1');
  shasum.update(str);
  str = shasum.digest('hex');
  return str;
}

/**
 * @param request
 *
 * @return url
 */
,
    getUrl = function getUrl(request) {
  if (request.headers.referer) {
    return request.headers.referer.split('#')[0];
  }
  return request.protocol + '://' + request.headers.host + request.originalUrl.split('#')[0];
};

module.exports = {
  createNonceStr: createNonceStr,
  createTimestamp: createTimestamp,
  raw: raw,
  sha1: sha1,
  getUrl: getUrl
};