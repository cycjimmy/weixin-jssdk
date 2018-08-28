const
  express = require('express')
  , app = express()
  , WxJssdk = require('../dist')

  , port = process.env.PORT || 3000
;

// set api
app.get('/api', (req, res) => {
  res.send('mock api');
});

let wxJssdk = new WxJssdk()
  .setWxConfig({
    appid: 'wxb36bf3640a94c61d',
    secret: '3a5e7056cc718ebdf72b41a5e2a88d3e',
  })
  .setHook();

app.get('/api/wxJssdk', (req, res) => {
  wxJssdk.wxshare({
    url: wxJssdk.tools.getUrl(req)
  })
    .then(data => {
      console.log(data);
      res.send(data);
    }, (err) => {
      res.send(err);
    });
});

app.listen(port, () => {
  console.log('App is listening at port ' + port + '!');
});

