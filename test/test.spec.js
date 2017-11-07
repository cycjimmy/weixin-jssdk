let
  wxjssdk = require('../src')
;

describe('spec', () => {
  test('is running?', () => {
    let
      params = {
        appid: 'wxcc6445076f2002c3',
        secret: 'd4624c36b6795d1d99dcf0547af5443d',
        url: 'https://aaa.cc/bbb?d=1&e=2#fortest'
      };

    wxjssdk(params)
      .then(data=>{
        expect(data.signature).toBeTruthy();
      });
  });
});