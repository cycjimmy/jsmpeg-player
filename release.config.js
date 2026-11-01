import process from 'node:process'
import makeConfig from '@cycjimmy/config-lib/esm/semanticRelease/19.x/makeConfigWithPgkRootForLibrary.js'

import pkg from './package.json' with { type: 'json' }

const config = makeConfig({
  githubOptions: {
    assets: [pkg.browser],
  },
})

// Set SKIP_NPM_AUTH=true to skip npm credential verification (e.g. dry-run
// jobs that never publish). See @semantic-release/npm's `npmPublish` option.
if (process.env.SKIP_NPM_AUTH === 'true') {
  config.plugins = config.plugins.map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === '@semantic-release/npm' && plugin[1] && plugin[1].pkgRoot) {
      return [
        plugin[0],
        { ...plugin[1], npmPublish: false },
      ]
    }

    return plugin
  })
}

export default config
