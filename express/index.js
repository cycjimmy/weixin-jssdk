const
  express = require('express')
;

let
  app = express()
  , wxjssdk = require('../src')
;

// static
app.use('/static', express.static('static'));

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

app.listen(process.env.PORT || 3000);