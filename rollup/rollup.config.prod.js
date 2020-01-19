import pkg from '../package.json';

import { banner, input, name, plugins, terserPlugins } from './rollup.common';

export default [
  {
    input,
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }],
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
