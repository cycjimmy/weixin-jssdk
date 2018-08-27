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
      getAccessTokenSuccess: function getAccessTokenSuccess(access_token) {
        return Promise.resolve(access_token);
      },
      getAccessTokenFromCustom: function getAccessTokenFromCustom() {
        return Promise.resolve('');
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
    key: '_getAccessToken',


    /**
     * _getAccessToken: Task1
     * @private
     */
    value: function _getAccessToken() {
      var _this = this;

      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$autoRunTask = _ref3.autoRunTask,
          autoRunTask = _ref3$autoRunTask === undefined ? false : _ref3$autoRunTask;

      return Promise.resolve().then(function () {
        _this.cache.get('access_token', function (err, value) {
          if (!err && value !== undefined) {
            console.log('access_token: Has cache');
            return Promise.resolve(value);
          }

          return _this.hook.getAccessTokenFromCustom().then(function (access_token) {
            if (access_token) {
              return Promise.resolve(access_token);
            }

            // getAccessToken from wx
            console.log('access_token: Start getAccessToken from wx');
            return _this.tools.getAccessToken({
              config: _this.config,
              wxConfig: _this.wxConfig
            }).then(function (access_token) {
              // cache access_token
              _this.cache.set('access_token', access_token, 3600, function (err, success) {
                if (!err && success) {
                  console.log('access_token: Set access_token success');
                  return _this.hook.getAccessTokenSuccess(access_token);
                }
              });
            });
          });
        });
      }).then(function (access_token) {
        if (!access_token) {
          return Promise.reject(new Error('Get access_token fail'));
        }

        console.log('access_token: GetAccessToken ' + access_token);
        if (autoRunTask) {
          return _this._getApiTicket({
            access_token: access_token,
            autoRunTask: true
          });
        }

        return Promise.resolve(access_token);
      });
    }
  }, {
    key: '_getApiTicket',


    /**
     * _getApiTicket: Task2
     * @param access_token
     * @param autoRunTask
     * @return {*}
     * @private
     */
    value: function _getApiTicket() {
      var _this2 = this;

      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$access_token = _ref4.access_token,
          access_token = _ref4$access_token === undefined ? '' : _ref4$access_token;

      // getApiTicket from wx
      if (access_token !== undefined) {
        return this.tools.getApiTicket({
          config: this.config,
          access_token: access_token
        }).then(function (api_ticket) {
          return new Promise(function (resolve, reject) {
            // cache api_ticket
            _this2.cache.set('api_ticket', api_ticket, function (err, success) {
              if (!err && success) {
                console.log('api_ticket: Get api_ticket success');
                resolve(api_ticket);
              } else {
                reject(err);
              }
            });
          });
        });
      }

      // getApiTicket from cache
      this.cache.get('api_ticket', function (err, value) {
        if (!err && value !== undefined) {
          console.log('api_ticket: Has cache');
          return Promise.resolve(value);
        }

        console.log('api_ticket: need get accessToken');
        return _this2._getAccessToken({ autoRunTask: true });
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
      var _this3 = this;

      var api_ticket = _ref5.api_ticket,
          url = _ref5.url;

      return new Promise(function (resolve) {
        var ret = _this3.tools.ticketSign(api_ticket, url);
        setTimeout(function () {
          return resolve({
            appId: _this3.wxConfig.appid,
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
      var _this4 = this;

      var url = _ref6.url;

      return this._getApiTicket().then(function (api_ticket) {
        return _this4._finalSign({
          api_ticket: api_ticket,
          url: url
        });
      }).catch(function (err) {
        return Promise.reject(err);
      });
    }
  }]);

  return WxJssdk;
}();

module.exports = WxJssdk;