# Weixin Jssdk

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![devDependencies Status][david-dev-image]][david-dev-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/weixin-jssdk.svg?style=flat-square
[npm-url]: https://npmjs.org/package/weixin-jssdk
[travis-image]: https://img.shields.io/travis/cycdpo/weixin-jssdk.svg?style=flat-square
[travis-url]: https://travis-ci.org/cycdpo/weixin-jssdk
[david-image]: https://img.shields.io/david/cycdpo/weixin-jssdk.svg?style=flat-square
[david-url]: https://david-dm.org/cycdpo/weixin-jssdk
[david-dev-image]: https://david-dm.org/cycdpo/weixin-jssdk/dev-status.svg?style=flat-square
[david-dev-url]: https://david-dm.org/cycdpo/weixin-jssdk?type=dev
[node-image]: https://img.shields.io/badge/node.js-%3E=_6.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/weixin-jssdk.svg?style=flat-square
[download-url]: https://npmjs.org/package/weixin-jssdk
[license-image]: https://img.shields.io/npm/l/weixin-jssdk.svg?style=flat-square

## Install
```shell
# via npm
$ npm install weixin-jssdk --save

# or via yarn
$ yarn add weixin-jssdk
```

## Use
```javascript
let wxjssdk = require('weixin-jssdk');

let params = {
  appid: 'your appid',
  secret: 'your secret',
  url: 'whole url'
};

wxjssdk(params).then(data => {
  // Do something
  // ...
});
```
