/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const makeCommonConfig = require('@cycjimmy/config-lib/cjs/semanticRelease/15.x/makeCommonConfig.cjs').default;
const pkg = require('./package.json');

module.exports = makeCommonConfig({
  exec: true,
  execOptions: {
    prepareCmd: 'npm run package',
  },
  npmOptions: {
    pkgRoot: '.release',
  },
  githubOptions: {
    assets: [pkg.browser],
  },
});
