const
  superagent = require('superagent')
;

module.exports = ({
                    config,
                    wxConfig
                  }) => new Promise((resolve, reject) => {
  superagent
    .get(config.url.token)
    .query({
      grant_type: config.grant_type,
      appid: wxConfig.appid,
      secret: wxConfig.secret
    })
    .accept('application/json')
    .end((err, s_res) => {
      if (err) {
        reject(err);
      }

      resolve(JSON.parse(s_res.text).access_token);
    });
});
