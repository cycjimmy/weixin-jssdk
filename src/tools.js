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
      if (newArgs.hasOwnProperty(k)) {
        string += '&' + k + '=' + newArgs[k];
      }
    }
    string = string.substr(1);
    return string;
  }

  , sha1 = (str) => {
    let shasum = crypto.createHash('sha1');
    shasum.update(str);
    str = shasum.digest('hex');
    return str;
  }

  /**
   * @param request
   *
   * @return url
   */
  , getUrl = request => {
    if (request.headers.referer) {
      return request.headers.referer.split('#')[0];
    }
    return request.protocol + '://' + request.headers.host + request.originalUrl.split('#')[0];
  }
;

module.exports = {
  createNonceStr,
  createTimestamp,
  raw,
  sha1,
  getUrl
};