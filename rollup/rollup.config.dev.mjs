import browsersync from 'rollup-plugin-browsersync'
import copy from 'rollup-plugin-copy'

import pkg from '../package.cjs'

import {
  input,
  IS_DEPLOYMENT,
  IS_DEVELOPMENT,
  name,
  plugins,
} from './rollup.common.mjs'

export default [
  {
    input,
    output: {
      name,
      file: pkg.browser.replace('.min.js', '.js'),
      format: 'umd',
      exports: 'default',
    },
    plugins: [
      ...plugins,

      IS_DEPLOYMENT
      && copy({
        hook: 'writeBundle',
        targets: [
          {
            src: ['static/**/*', 'dist/**.umd.js'],
            dest: '.publish',
          },
        ],
      }),
      IS_DEVELOPMENT
      && browsersync({
        server: ['static', 'dist'],
        watch: true,
      }),
    ],
  },
]
