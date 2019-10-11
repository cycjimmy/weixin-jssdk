# Weixin Jssdk

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![devDependencies Status][david-dev-image]][david-dev-url]
[![npm download][download-image]][download-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@cycjimmy/weixin-jssdk.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@cycjimmy/weixin-jssdk
[travis-image]: https://img.shields.io/travis/cycjimmy/weixin-jssdk.svg?style=flat-square
[travis-url]: https://travis-ci.org/cycjimmy/weixin-jssdk
[david-image]: https://img.shields.io/david/cycjimmy/weixin-jssdk.svg?style=flat-square
[david-url]: https://david-dm.org/cycjimmy/weixin-jssdk
[david-dev-image]: https://david-dm.org/cycjimmy/weixin-jssdk/dev-status.svg?style=flat-square
[david-dev-url]: https://david-dm.org/cycjimmy/weixin-jssdk?type=dev
[download-image]: https://img.shields.io/npm/dm/@cycjimmy/weixin-jssdk.svg?style=flat-square
[download-url]: https://npmjs.org/package/@cycjimmy/weixin-jssdk
[license-image]: https://img.shields.io/npm/l/@cycjimmy/weixin-jssdk.svg?style=flat-square

## Install
```shell
# via npm
$ npm install @cycjimmy/weixin-jssdk --save

# or via yarn
$ yarn add @cycjimmy/weixin-jssdk
```

## Use
```javascript
const WxJssdk = require('@cycjimmy/weixin-jssdk');

const wxJssdk = new WxJssdk()
  .setWxConfig({
    appid: 'your appid',
    secret: 'your secret',
  })
  [.setHook({
    getAccessTokenSuccess: new Promise...,
    getAccessTokenFromCustom: new Promise...,
  })];

wxJssdk.wxshare({
   url: 'whole url'
})
.then(data => {
  // Do something
  // ...
});
```

## More
* `wxJssdk.setHook`: [Object] Set Hook Functions.
  * `getAccessTokenSuccess`: [Promise] Run Hook when get Access_Token success. Please resolve Access_Token.
  * `getAccessTokenFromCustom`: [Promise] Run custom task Before get Access_Token from wechat. Please resolve Access_Token.

