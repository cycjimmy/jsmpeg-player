import path from 'node:path'
import fs from 'fs-extra'

const { copySync, emptyDirSync } = fs

const publishDir = path.resolve('.publish')

// Clean first to keep the deployment output idempotent.
emptyDirSync(publishDir)

// Same as the old rollup-plugin-copy behavior: static/**/* and dist/**.umd.js → .publish
copySync(path.resolve('static'), publishDir)
copySync(
  path.resolve('dist', 'jsmpeg-player.umd.js'),
  path.resolve(publishDir, 'jsmpeg-player.umd.js'),
)

console.log('copyPublishFiles success!')
