'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeCache = require('node-cache');

var _nodeCache2 = _interopRequireDefault(_nodeCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WxJssdk = function () {
  function WxJssdk() {
    _classCallCheck(this, WxJssdk);

    this.wxConfig = {};

    this.config = {
      url: {
        token: 'https://api.weixin.qq.com/cgi-bin/token',
        ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
      },
      grant_type: 'client_credential'
    };

    this.hook = {
      getAccessTokenFromCustom: function getAccessTokenFromCustom() {
        return Promise.resolve('');
      },
      getAccessTokenSuccess: function getAccessTokenSuccess(access_token) {
        return Promise.resolve(access_token);
      }
    };

    this.cache = new _nodeCache2.default({
      stdTTL: 3600
    });

    this.tools = {
      getUrl: require('./tools').getUrl,
      getAccessToken: require('./getAccessToken'),
      getApiTicket: require('./getApiTicket'),
      getSignature: require('./sign').getSignature,
      ticketSign: require('./sign').ticketSign,
      handleServerVerify: require('./handleServerVerify')
    };
  }

  _createClass(WxJssdk, [{
    key: 'setWxConfig',


    /**
     * setWxConfig
     * @param appid
     * @param secret
     * @return {WxJssdk}
     */
    value: function setWxConfig(_ref) {
      var appid = _ref.appid,
          secret = _ref.secret;

      this.wxConfig.appid = appid;
      this.wxConfig.secret = secret;

      return this;
    }
  }, {
    key: 'setHook',


    /**
     * setHook
     * @param getAccessTokenSuccess
     * @param getAccessTokenFromCustom
     * @return {WxJssdk}
     */
    value: function setHook() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          getAccessTokenSuccess = _ref2.getAccessTokenSuccess,
          getAccessTokenFromCustom = _ref2.getAccessTokenFromCustom;

      if (getAccessTokenSuccess) {
        this.hook.getAccessTokenSuccess = getAccessTokenSuccess;
      }

      if (getAccessTokenFromCustom) {
        this.hook.getAccessTokenFromCustom = getAccessTokenFromCustom;
      }

      return this;
    }
  }, {
    key: 'setAccessTokenCache',


    /**
     * setAccessTokenCache
     * @param access_token
     * @param TTL
     * @return {Promise<any>}
     */
    value: function setAccessTokenCache(_ref3) {
      var _this = this;

      var access_token = _ref3.access_token,
          _ref3$TTL = _ref3.TTL,
          TTL = _ref3$TTL === undefined ? 3600 : _ref3$TTL;

      return new Promise(function (resolve) {
        // cache access_token
        _this.cache.set('access_token', access_token, TTL, function (err, success) {
          if (!err && success) {
            console.log('access_token: Set access_token success [' + access_token + ']');
            resolve(access_token);
          }
        });
      });
    }
  }, {
    key: '_getAccessToken',


    /**
     * _getAccessToken: Task1
     * @private
     */
    value: function _getAccessToken() {
      var _this2 = this;

      var _getAccessTokenFromCache = function _getAccessTokenFromCache() {
        return new Promise(function (resolve) {
          _this2.cache.get('access_token', function (err, value) {
            if (!err && value !== undefined) {
              console.log('access_token: Has cache');
              resolve(value);
            } else {
              console.log('access_token: No cache');
              resolve();
            }
          });
        });
      },
          _getAccessTokenFromWX = function _getAccessTokenFromWX() {
        return _this2.tools.getAccessToken({
          config: _this2.config,
          wxConfig: _this2.wxConfig
        }).then(function (access_token) {
          if (!access_token) {
            console.error('access_token: getAccessTokenFromWX fail!');
            return Promise.resolve();
          }

          return _this2.setAccessTokenCache({ access_token: access_token }).then(function (access_token) {
            return _this2.hook.getAccessTokenSuccess(access_token);
          });
        });
      },
          _getAccessTokenMainTask = function _getAccessTokenMainTask() {
        return _this2.hook.getAccessTokenFromCustom().then(function (access_token) {
          if (access_token) {
            return Promise.resolve(access_token);
          }

          return _getAccessTokenFromWX();
        });
      };

      return _getAccessTokenFromCache().then(function (access_token) {
        if (!access_token) {
          return _getAccessTokenMainTask();
        }

        return Promise.resolve(access_token);
      });
    }
  }, {
    key: '_getApiTicket',


    /**
     * _getApiTicket: Task2
     * @param access_token
     * @return {*}
     * @private
     */
    value: function _getApiTicket() {
      var _this3 = this;

      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$access_token = _ref4.access_token,
          access_token = _ref4$access_token === undefined ? '' : _ref4$access_token;

      var _getApiTicketFromCache = function _getApiTicketFromCache() {
        return new Promise(function (resolve) {
          _this3.cache.get('api_ticket', function (err, value) {
            if (!err && value !== undefined) {
              console.log('api_ticket: Has cache');
              resolve(value);
            } else {
              console.log('api_ticket: No cache');
              resolve();
            }
          });
        });
      },
          _getApiTicketFromWX = function _getApiTicketFromWX() {
        return _this3.tools.getApiTicket({
          config: _this3.config,
          access_token: access_token
        }).then(function (api_ticket) {
          return new Promise(function (resolve) {
            if (api_ticket) {
              // cache api_ticket
              _this3.cache.set('api_ticket', api_ticket, function (err, success) {
                if (!err && success) {
                  console.log('api_ticket: Set success [' + api_ticket + ']');
                  resolve(api_ticket);
                }
              });
            } else {
              console.error('api_ticket: getApiTicketFromWX fail!');
              resolve();
            }
          });
        });
      };

      if (!access_token) {
        return Promise.resolve();
      }

      return _getApiTicketFromCache().then(function (api_ticket) {
        if (!api_ticket) {
          return _getApiTicketFromWX();
        }

        return Promise.resolve(api_ticket);
      });
    }
  }, {
    key: '_finalSign',


    /**
     * Final Sign: Task3
     * @param api_ticket
     * @param url
     * @return {Promise<any>}
     * @private
     */
    value: function _finalSign(_ref5) {
      var _this4 = this;

      var api_ticket = _ref5.api_ticket,
          url = _ref5.url;


      console.log('finalSign: [' + api_ticket + '] [' + url + ']');
      return new Promise(function (resolve) {
        var ret = _this4.tools.ticketSign(api_ticket, url);
        setTimeout(function () {
          return resolve({
            appId: _this4.wxConfig.appid,
            timestamp: ret.timestamp,
            nonceStr: ret.nonceStr,
            signature: ret.signature
          });
        }, 0);
      });
    }
  }, {
    key: 'wxshare',


    /**
     * wxshare
     * @param url
     * @return {Request|PromiseLike<any>|Promise<any>}
     */
    value: function wxshare(_ref6) {
      var _this5 = this;

      var url = _ref6.url;


      return this._getAccessToken().then(function (access_token) {
        return _this5._getApiTicket({ access_token: access_token });
      }).then(function (api_ticket) {
        return _this5._finalSign({
          api_ticket: api_ticket,
          url: url
        });
      });
    }
  }]);

  return WxJssdk;
}();

module.exports = WxJssdk;