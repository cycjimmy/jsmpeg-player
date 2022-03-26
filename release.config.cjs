/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const makeConfig = require('@cycjimmy/config-lib/cjs/semanticRelease/19.x/makeConfigWithPgkRootForLibrary.cjs').default;
const pkg = require('./package.json');

module.exports = makeConfig({
  githubOptions: {
    assets: [pkg.browser],
  },
});
