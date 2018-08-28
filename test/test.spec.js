let
  WxJssdk = require('../dist')
;

describe('spec', () => {
  test('is running?', () => {
    let
      params = {
        appid: 'wxcc6445076f2002c3',
        secret: 'd4624c36b6795d1d99dcf0547af5443d',
        url: 'https://aaa.cc/bbb?d=1&e=2#fortest'
      };

    let wxJssdk = new WxJssdk()
      .setWxConfig({
        appid: 'wxcc6445076f2002c3',
        secret: 'd4624c36b6795d1d99dcf0547af5443d',
      })
      .setHook()
      .wxshare({
        url: 'https://aaa.cc/bbb?d=1&e=2#fortest'
      })
      .then(data => {
        expect(data.signature).toBeTruthy();
      });
  });
});

