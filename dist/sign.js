'use strict';

var _require = require('./tools'),
    createNonceStr = _require.createNonceStr,
    createTimestamp = _require.createTimestamp,
    raw = _require.raw,
    sha1 = _require.sha1;

var getSignature = function getSignature(obj) {
  var str = raw(obj);
  return sha1(str);
}

/**
 * @param jsapi_ticket
 * @param url
 *
 * @returns
 */
,
    ticketSign = function ticketSign(jsapi_ticket, url) {
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url: url
  };

  ret.signature = getSignature(ret);
  return ret;
};

/**
 *
 * @param jsapi_ticket
 * @param url
 *
 * @returns
 */
module.exports = {
  getSignature: getSignature,
  ticketSign: ticketSign
};