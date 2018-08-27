const NodeCache = require('node-cache');

module.exports =class WxJssdk {
  constructor() {
    this.wxConfig = {};

    this.config = {
      url: {
        token: 'https://api.weixin.qq.com/cgi-bin/token',
        ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
      },
      grant_type: 'client_credential',
    };

    this.hook = {
      getAccessTokenSuccess: access_token => Promise.resolve(access_token),
      getAccessTokenFromCustom: () => Promise.resolve(''),
    };

    this.cache = new NodeCache({
      stdTTL: 3600,
    });

    this.tools = {
      getUrl: require('./tools').getUrl,
      getAccessToken: require('./getAccessToken'),
      getApiTicket: require('./getApiTicket'),
      getSignature: require('./sign').getSignature,
      ticketSign: require('./sign').ticketSign,
      handleServerVerify: require('./handleServerVerify')
    };
  };

  /**
   * setWxConfig
   * @param appid
   * @param secret
   * @return {WxJssdk}
   */
  setWxConfig({
                appid,
                secret
              }) {
    this.wxConfig.appid = appid;
    this.wxConfig.secret = secret;

    return this;
  };

  /**
   * setHook
   * @param getAccessTokenSuccess
   * @param getAccessTokenFromCustom
   * @return {WxJssdk}
   */
  setHook({
            getAccessTokenSuccess,
            getAccessTokenFromCustom
          } = {}) {
    if (getAccessTokenSuccess) {
      this.hook.getAccessTokenSuccess = getAccessTokenSuccess;
    }

    if (getAccessTokenFromCustom) {
      this.hook.getAccessTokenFromCustom = getAccessTokenFromCustom;
    }

    return this;
  };

  /**
   * _getAccessToken: Task1
   * @private
   */
  _getAccessToken({
                    autoRunTask = false
                  } = {}) {
    return Promise.resolve()
      .then(() => {
        this.cache.get('access_token', (err, value) => {
          if (!err && value !== undefined) {
            return Promise.resolve(value);
          }

          return this.hook.getAccessTokenFromCustom()
            .then(access_token => {
              if (access_token) {
                return Promise.resolve(access_token);
              }

              // getAccessToken from wx
              return this.tools.getAccessToken({
                config: this.config,
                wxConfig: this.wxConfig,
              })
                .then(access_token => {
                  // cache access_token
                  this.cache.set('access_token', access_token, 3600, (err, success) => {
                    if (!err && success) {
                      console.log('get access_token success');
                      return this.hook.getAccessTokenSuccess(access_token);
                    }
                  });
                });
            });
        });
      })
      .then(access_token => {
        if (autoRunTask) {
          return this._getApiTicket({
            access_token,
            autoRunTask: true,
          })
        }

        return Promise.resolve(access_token);
      });
  };

  /**
   * _getApiTicket: Task2
   * @param access_token
   * @param autoRunTask
   * @return {*}
   * @private
   */
  _getApiTicket({
                  access_token = '',
                } = {}) {
    // getApiTicket from wx
    if (access_token) {
      return this.tools.getApiTicket({
        config: this.config,
        access_token
      })
        .then(api_ticket => new Promise((resolve, reject) => {
          // cache api_ticket
          this.cache.set('api_ticket', api_ticket, (err, success) => {
            if (!err && success) {
              console.log('get api_ticket success');
              resolve(api_ticket);
            } else {
              reject(err);
            }
          });
        }));
    }

    // getApiTicket from cache
    this.cache.get('api_ticket', (err, value) => {
      if (!err && value !== undefined) {
        return Promise.resolve(value);
      }

      return this._getAccessToken({autoRunTask: true});
    });
  };

  /**
   * Final Sign: Task3
   * @param api_ticket
   * @param url
   * @return {Promise<any>}
   * @private
   */
  _finalSign({
               api_ticket,
               url
             }) {
    return new Promise(resolve => {
      const ret = this.tools.ticketSign(api_ticket, url);
      setTimeout(() => resolve({
        appId: this.wxConfig.appid,
        timestamp: ret.timestamp,
        nonceStr: ret.nonceStr,
        signature: ret.signature,
      }), 0);
    })
  };

  /**
   * wxshare
   * @param url
   * @return {Request|PromiseLike<any>|Promise<any>}
   */
  wxshare({
            url
          }) {
    return this._getApiTicket()
      .then(api_ticket => this._finalSign({
        api_ticket,
        url
      }));
  };
};

