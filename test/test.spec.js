let
  WxJssdk = require('../dist')
;

describe('spec', () => {
  test('is running?', () => {
    const
      params = {
        appid: 'wxcc6445076f2002c3',
        secret: 'd4624c36b6795d1d99dcf0547af5443d',
        url: 'https://aaa.cc/bbb?d=1&e=2#fortest'
      };

    const wxJssdk = new WxJssdk()
      .setWxConfig({
        appid: params.appid,
        secret: params.secret,
      })
      .setHook()
      .wxshare({
        url: params.url,
      })
      .then(data => {
        expect(data.signature).toBeTruthy();
      });
  });
});

