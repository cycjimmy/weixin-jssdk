const
  superagent = require('superagent')
;

module.exports = ({
                    config,
                    cache,
                  }) => new Promise(resolve => {
  let
    _getAccessTokenFromWeixin = () => {
      return new Promise((resolve, reject) => {
        superagent
          .get(config.url.token)
          .query({
            grant_type: config.grant_type,
            appid: config.appid,
            secret: config.secret
          })
          .accept('application/json')
          .end((err, s_res) => {
            if (err) {
              reject(err);
            }

            let
              access_token = JSON.parse(s_res.text).access_token
            ;
            console.log('access_token: ' + access_token);

            // set access_token
            cache.set("access_token", access_token, (err, success) => {
              if (!err && success) {
                console.log('get access_token success');
                resolve(access_token);
              }
            });
          });
      });
    };

  cache.get('access_token', (err, value) => {
    if (!err && value !== undefined) {
      resolve(value);
    } else {
      _getAccessTokenFromWeixin()
        .then(access_token => {
          resolve(access_token);
        });
    }
  });
})
;