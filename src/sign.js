const
  crypto = require('crypto')
;

let
  createNonceStr = () => Math.random().toString(36).substr(2, 15)
  , createTimestamp = () => parseInt(new Date().getTime() / 1000) + ''

  , raw = (args) => {
    let
      keys = Object.keys(args)
      , newArgs = {}
      , string = ''
    ;
    keys = keys.sort();

    keys.forEach((key) => {
      newArgs[key.toLowerCase()] = args[key];
    });

    for (let k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  }

  , sha1 = (str) => {
    let shasum = crypto.createHash("sha1");
    shasum.update(str);
    str = shasum.digest("hex");
    return str;
  }
;

/**
 *
 * @param jsapi_ticket
 * @param url
 *
 * @returns
 */
module.exports = (jsapi_ticket, url) => {
  let ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url: url
  };

  let
    string = raw(ret)
  ;
  ret.signature = sha1(string);
  return ret;
};

