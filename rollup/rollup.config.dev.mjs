/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint import/extensions: ["error", "ignorePackages", {"mjs": off}] */
import browsersync from 'rollup-plugin-browsersync';
import copy from 'rollup-plugin-copy';

import pkg from '../package.cjs';

import {
  input, IS_DEVELOPMENT, IS_DEPLOYMENT, name, plugins,
} from './rollup.common.mjs';

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
];
