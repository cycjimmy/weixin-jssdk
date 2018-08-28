import NodeCache from 'node-cache';

class WxJssdk {
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
      getAccessTokenFromCustom: () => Promise.resolve(''),
      getAccessTokenSuccess: access_token => Promise.resolve(access_token),
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
   * setAccessTokenCache
   * @param access_token
   * @param TTL
   * @return {Promise<any>}
   */
  setAccessTokenCache({
                        access_token,
                        TTL = 3600
                      }) {
    return new Promise(resolve => {
      // cache access_token
      this.cache.set('access_token', access_token, TTL, (err, success) => {
        if (!err && success) {
          console.log('access_token: Set access_token success [' + access_token + ']');
          resolve(access_token);
        }
      });
    })
  };

  /**
   * _getAccessToken: Task1
   * @private
   */
  _getAccessToken() {
    const
      _getAccessTokenFromCache = () => new Promise(resolve => {
        this.cache.get('access_token', (err, value) => {
          if (!err && value !== undefined) {
            console.log('access_token: Has cache');
            resolve(value);
          } else {
            console.log('access_token: No cache');
            resolve();
          }
        });
      })

      , _getAccessTokenFromWX = () => this.tools.getAccessToken({
        config: this.config,
        wxConfig: this.wxConfig,
      })
        .then(access_token => this.setAccessTokenCache({access_token})
          .then(access_token => this.hook.getAccessTokenSuccess(access_token)))

      , _getAccessTokenMainTask = () => this.hook.getAccessTokenFromCustom()
        .then(access_token => {
          if (access_token) {
            return Promise.resolve(access_token);
          }

          return _getAccessTokenFromWX();
        })
    ;

    return _getAccessTokenFromCache()
      .then(access_token => {
        if (!access_token) {
          return _getAccessTokenMainTask();
        }

        return Promise.resolve(access_token);
      });
  };

  /**
   * _getApiTicket: Task2
   * @param access_token
   * @return {*}
   * @private
   */
  _getApiTicket({
                  access_token = '',
                } = {}) {

    const
      _getApiTicketFromCache = () => new Promise(resolve => {
        this.cache.get('api_ticket', (err, value) => {
          if (!err && value !== undefined) {
            console.log('api_ticket: Has cache');
            resolve(value);
          } else {
            console.log('api_ticket: No cache');
            resolve();
          }
        });
      })
      , _getApiTicketFromWX = () => this.tools.getApiTicket({
        config: this.config,
        access_token
      })
        .then(api_ticket => new Promise(resolve => {
          // cache api_ticket
          this.cache.set('api_ticket', api_ticket, (err, success) => {
            if (!err && success) {
              console.log('api_ticket: Set success [' + api_ticket + ']');
              resolve(api_ticket);
            }
          });
        }))
    ;

    if (!access_token) {
      return Promise.resolve()
    }

    return _getApiTicketFromCache()
      .then(api_ticket => {
        if (!api_ticket) {
          return _getApiTicketFromWX();
        }

        return Promise.resolve(api_ticket);
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

    console.log('finalSign: [' + api_ticket + '] [' + url + ']');
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

    return this._getAccessToken()
      .then(access_token => this._getApiTicket({access_token}))
      .then(api_ticket => this._finalSign({
        api_ticket,
        url
      }));
  };
}

module.exports = WxJssdk;

