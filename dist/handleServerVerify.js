"use strict";

const {
  sha1
} = require('./tools');
/**
 * handleServerVerify
 * @param token
 */


module.exports = token => (req, res, next) => {
  let {
    signature,
    timestamp,
    nonce,
    echostr
  } = req.query;

  if (!signature || !timestamp || !nonce) {
    return res.send('invalid request');
  }

  if (req.method === 'POST') {
    console.log('handleServerVerify.post:', {
      body: req.body,
      query: req.query
    });
  }

  if (req.method === 'GET') {
    console.log('handleServerVerify.get:', {
      body: req.body
    });

    if (!echostr) {
      return res.send('invalid request');
    }
  }

  let params = [token, timestamp, nonce];
  params.sort();
  let sign = sha1(params.join(''));

  if (signature !== sign) {
    res.send('invaid sign');
  }

  if ('GET' === req.method) {
    res.send(echostr ? echostr : 'invaid sign');
  } else {
    let postdata = '';
    req.addListener("data", postchunk => {
      postdata += postchunk;
    });
    req.addListener("end", () => {
      console.log(postdata);
      res.send('success');
    });
  }
};