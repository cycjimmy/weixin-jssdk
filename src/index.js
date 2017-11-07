const
  NodeCache = require('node-cache')
  , sign = require('./sign')
;

let
  getAccessToken = require('./getAccessToken')
  , getApiTicket = require('./getApiTicket')

  , cache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 3600
  })

  , config = {
    url: {
      token: 'https://api.weixin.qq.com/cgi-bin/token',
      ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
    },
    grant_type: 'client_credential',
  }
;

module.exports = ({
                    url,
                    appid,
                    secret
                  }) => {

  config.appid = appid;
  config.secret = secret;

  return getAccessToken({config, cache})                                // get access_token
    .then(access_token => getApiTicket({config, cache, access_token}))  // get api_ticket
    .then(api_ticket => new Promise(resolve => {
      let
        ret = sign(api_ticket, url)
      ;

      setTimeout(() => resolve({
        appId: appid,
        timestamp: ret.timestamp,
        nonceStr: ret.nonceStr,
        signature: ret.signature,
      }), 0);
    }));
};

