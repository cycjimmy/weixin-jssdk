const WxJssdk = require('../dist');

describe('spec', () => {
  test('is running?', () => {
    const params = {
      appid: 'wxb02457e1f23b6db2',
      secret: '1b0bf9d7a2ffdbce126dd6bea370bf40',
      url: 'https://aaa.cc/bbb?d=1&e=2#fortest'
    };

    new WxJssdk()
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

