/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const makeConfig = require('@cycjimmy/config-lib/cjs/semanticRelease/19.x/makeConfigWithPgkRootForLibrary.cjs').default;
const pkg = require('./package.json');

// Set SKIP_NPM_AUTH=true to skip npm credential verification (e.g. dry-run
// jobs that never publish). See @semantic-release/npm's `npmPublish` option.
const config = makeConfig({
  githubOptions: {
    assets: [pkg.browser],
  },
});

if (process.env.SKIP_NPM_AUTH === 'true') {
  config.plugins = config.plugins.map((plugin) => (
    Array.isArray(plugin) && plugin[0] === '@semantic-release/npm'
      ? ['@semantic-release/npm', { ...plugin[1], npmPublish: false }]
      : plugin
  ));
}

module.exports = config;
