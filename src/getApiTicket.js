const
  superagent = require('superagent')
;

module.exports = ({
                    config,
                    cache,
                    access_token,
                  }) => new Promise(resolve => {
  let _getApiTicketFromWeixin = () => {
    return new Promise((resolve, reject) => {
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

          let
            api_ticket = JSON.parse(s_res.text).ticket
          ;
          console.log('api_ticket: ' + api_ticket);

          // set access_token
          cache.set("api_ticket", api_ticket, (err, success) => {
            if (!err && success) {
              console.log('get api_ticket success');
              resolve(api_ticket);
            }
          });
        });
    });
  };

  cache.get('api_ticket', (err, value) => {
    if (!err && value !== undefined) {
      resolve(value);
    } else {
      _getApiTicketFromWeixin()
        .then(api_ticket => {
          resolve(api_ticket);
        });
    }
  });
});

