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

const wxJssdk = new WxJssdk()
  .setWxConfig({
    appid: 'wxb02457e1f23b6db2',
    secret: '1b0bf9d7a2ffdbce126dd6bea370bf40',
  })
  .setHook();

app.get('/api/wxJssdk', (req, res) => {
  // res.send(wxJssdk.tools.getUrl(req));
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

