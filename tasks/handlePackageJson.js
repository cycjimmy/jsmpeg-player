import path from 'node:path'
import fs from 'fs-extra'

const { readJsonSync, outputJsonSync } = fs

const jsonData = readJsonSync(
  path.resolve('package.json'),
)

if (jsonData.scripts) {
  delete jsonData.scripts
}

if (jsonData.dependencies) {
  delete jsonData.dependencies
}

if (jsonData.devDependencies) {
  delete jsonData.devDependencies
}

if (jsonData.publishConfig) {
  delete jsonData.publishConfig
}

if (jsonData.config) {
  delete jsonData.config
}

if (jsonData.engines) {
  delete jsonData.engines
}

outputJsonSync(
  path.resolve('.release', 'package.json'),
  jsonData,
  {
    spaces: 2,
  },
)

console.log('handlePackageJson success!')
