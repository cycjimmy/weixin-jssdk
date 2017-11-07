# Weixin Jssdk

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![devDependencies Status][david-dev-image]][david-dev-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/weixinjssdk.svg?style=flat-square
[npm-url]: https://npmjs.org/package/weixinjssdk
[travis-image]: https://img.shields.io/travis/cycdpo/weixinjssdk.svg?style=flat-square
[travis-url]: https://travis-ci.org/cycdpo/weixinjssdk
[david-image]: https://img.shields.io/david/cycdpo/weixinjssdk.svg?style=flat-square
[david-url]: https://david-dm.org/cycdpo/weixinjssdk
[david-dev-image]: https://david-dm.org/cycdpo/weixinjssdk/dev-status.svg?style=flat-square
[david-dev-url]: https://david-dm.org/cycdpo/weixinjssdk?type=dev
[node-image]: https://img.shields.io/badge/node.js-%3E=_6.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/weixinjssdk.svg?style=flat-square
[download-url]: https://npmjs.org/package/weixinjssdk
[license-image]: https://img.shields.io/npm/l/weixinjssdk.svg?style=flat-square

## Install
```shell
# via npm
$ npm install weixinjssdk --save

# or via yarn
$ yarn add weixinjssdk
```

## Use
```javascript
let wxjssdk = require('weixinjssdk');

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
