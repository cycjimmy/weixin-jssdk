const makeCommonConfig = require('@cycjimmy/config-lib/semanticRelease/15.x/makeCommonConfig');

module.exports = makeCommonConfig({
  exec: true,
  execOptions: {
    publishCmd: 'npm run build'
  }
});
