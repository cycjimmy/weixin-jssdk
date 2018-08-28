'use strict';

var _require = require('./tools'),
    sha1 = _require.sha1;

/**
 * handleServerVerify
 * @param token
 */


module.exports = function (token) {
  return function (req, res, next) {
    var _req$query = req.query,
        signature = _req$query.signature,
        timestamp = _req$query.timestamp,
        nonce = _req$query.nonce,
        echostr = _req$query.echostr;


    if (!signature || !timestamp || !nonce) {
      return res.send('invalid request');
    }

    if (req.method === 'POST') {
      console.log('handleServerVerify.post:', { body: req.body, query: req.query });
    }

    if (req.method === 'GET') {
      console.log('handleServerVerify.get:', { body: req.body });
      if (!echostr) {
        return res.send('invalid request');
      }
    }

    var params = [token, timestamp, nonce];
    params.sort();
    var sign = sha1(params.join(''));

    if (signature !== sign) {
      res.send('invaid sign');
    }

    if ('GET' === req.method) {
      res.send(echostr ? echostr : 'invaid sign');
    } else {
      var postdata = '';
      req.addListener("data", function (postchunk) {
        postdata += postchunk;
      });

      req.addListener("end", function () {
        console.log(postdata);
        res.send('success');
      });
    }
  };
};