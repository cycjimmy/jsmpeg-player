import pkg from '../package.json';

import { banner, input, name, plugins, terserPlugins } from './rollup.common';

export default [
  {
    input,
    output: [
      { file: pkg.main, format: 'cjs', exports: 'default' },
      { file: pkg.module, format: 'es', exports: 'default' }
    ],
    plugins
  },
  {
    input,
    output: {
      name,
      file: pkg.browser,
      format: 'umd',
      banner
    },
    plugins: [...plugins, terserPlugins]
  }
];
