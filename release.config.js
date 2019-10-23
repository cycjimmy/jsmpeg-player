const makeCommonConfig = require('@cycjimmy/config-lib/semanticRelease/15.x/makeCommonConfig');

module.exports = makeCommonConfig({
  githubOptions: {
    "assets": [
      "build/jsmpeg-player.min.js"
    ]
  },
  exec: true,
  execOptions: {
    prepareCmd: 'npm run build'
  }
});
