const
  {
    createNonceStr,
    createTimestamp,
    raw,
    sha1
  } = require('./tools')
;

let
  getSignature = obj => {
    let str = raw(obj);
    return sha1(str);
  }

  /**
   * @param jsapi_ticket
   * @param url
   *
   * @returns
   */
  , ticketSign = (jsapi_ticket, url) => {
    let ret = {
      jsapi_ticket: jsapi_ticket,
      nonceStr: createNonceStr(),
      timestamp: createTimestamp(),
      url: url
    };

    ret.signature = getSignature(ret);
    return ret;
  }
;

/**
 *
 * @param jsapi_ticket
 * @param url
 *
 * @returns
 */
module.exports = {
  getSignature,
  ticketSign
};

