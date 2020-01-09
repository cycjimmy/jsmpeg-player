import browsersync from 'rollup-plugin-browsersync';
import copy from 'rollup-plugin-copy';

import pkg from '../package.json';

import { input, IS_DEVELOPMENT, IS_DEPLOYMENT, name, plugins } from './rollup.common';

export default [
  {
    input,
    output: {
      name,
      file: pkg.browser.replace('.min.js', '.js'),
      format: 'umd'
    },
    plugins: [
      ...plugins,

      IS_DEPLOYMENT &&
        copy({
          hook: 'writeBundle',
          targets: [
            {
              src: ['static/**/*', 'dist/**.umd.js'],
              dest: '.publish'
            }
          ]
        }),
      IS_DEVELOPMENT &&
        browsersync({
          server: ['static', 'dist'],
          watch: true
        })
    ]
  }
];
