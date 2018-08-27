const
  superagent = require('superagent')
;

module.exports = ({
                    config,
                    access_token,
                  }) => new Promise((resolve, reject) => {
  superagent
    .get(config.url.ticket)
    .query({
      type: 'jsapi',
      access_token: access_token,
    })
    .accept('application/json')
    .end((err, s_res) => {
      if (err) {
        reject(err);
      }

      resolve(JSON.parse(s_res.text).ticket);
    });
});

