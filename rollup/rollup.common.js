import { eslint } from 'rollup-plugin-eslint';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import { terser } from 'rollup-plugin-terser';

import myBanner from '@cycjimmy/config-lib/cjs/chore/myBanner';
// config
import terserOption from '@cycjimmy/config-lib/cjs/terser/4.x/production';

import pkg from '../package.json';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEPLOYMENT = process.env.NODE_ENV === 'deployment';

export const input = './src/index.js';
export const name = 'JSMpeg';
export const banner = myBanner(pkg);

export const plugins = [
  json(),
  postcss({
    modules: {
      generateScopedName: IS_PRODUCTION ? '[hash:base64:10]' : '[name]__[local]'
    },
    autoModules: false,
    minimize: true,
    plugins: [autoprefixer]
  }),
  eslint({
    fix: true,
    exclude: ['**/*.(css|scss)']
  }),
  resolve(),
  babel({ babelHelpers: 'bundled' }),
  commonjs()
];

export const terserPlugins = IS_PRODUCTION && terser(terserOption);
