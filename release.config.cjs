/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const makeCommon = require('@cycjimmy/config-lib/cjs/semanticRelease/19.x/makeConfigWithPgkRootForLibrary.cjs').default;
const pkg = require('./package.json');

module.exports = makeCommon({
  githubOptions: {
    assets: [pkg.browser],
  },
});
