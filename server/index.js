const
  express = require('express')
  , app = express()
  , wxjssdk = require('../src')
  , port = process.env.PORT || 3000
;

// set api
app.get('/api', (req, res) => {
  res.send('mock api');
});

app.get('/api/wxJssdk', (req, res) => {
  wxjssdk({})
    .setWxConfig({
      appid: 'wxcc6445076f2002c3',
      secret: 'd4624c36b6795d1d99dcf0547af5443d',
    })
    .setHook()
    .wxshare({
      url: wxjssdk.tools.getUrl(req)
    })
    .then(data => {
      res.send(data);
    }, (err) => {
      res.send(err);
    });
});

app.listen(port, () => {
  console.log('App is listening at port ' + port + '!');
});

