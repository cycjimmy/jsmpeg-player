// eslint-disable-next-line import/no-extraneous-dependencies
const makeCommonConfig = require('@cycjimmy/config-lib/semanticRelease/15.x/makeCommonConfig');

const pkg = require('./package.json');

module.exports = makeCommonConfig({
  githubOptions: {
    assets: [pkg.browser]
  },
  exec: true,
  execOptions: {
    publishCmd: 'npm run build'
  }
});
