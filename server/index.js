const
  express = require('express')
  , path = require('path')
;

let
  app = express()
  , wxjssdk = require('../src')
  , port = process.env.PORT || 3000
;

// static
app.use('/static', express.static(path.resolve('static')));

// set api
app.get('/api/wxJssdk', (req, res) => {
  let
    _getUrl = req => req.protocol + '://' + req.headers.host + req.originalUrl.split('#')[0]
  ;

  wxjssdk({
    appid: 'wxcc6445076f2002c3',
    secret: 'd4624c36b6795d1d99dcf0547af5443d',
    url: _getUrl(req)
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

