const superagent = require('superagent');

module.exports = ({
                    config,
                    wxConfig
                  }) => new Promise(resolve => {
  superagent
    .get(config.url.token)
    .query({
      grant_type: config.grant_type,
      appid: wxConfig.appid,
      secret: wxConfig.secret
    })
    .set('accept', 'json')
    .end((err, s_res) => {
      if (err) {
        resolve();
      } else {
        const access_token = JSON.parse(s_res.text).access_token;

        access_token ? resolve(access_token): resolve();
      }
    });
});
