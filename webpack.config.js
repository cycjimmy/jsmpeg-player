let
  path = require('path')

  // webpack plugin
  , UglifyJsPlugin = require('uglifyjs-webpack-plugin')
  , CleanWebpackPlugin = require('clean-webpack-plugin')
;

const
  IS_PRODUCTION = process.env.NODE_ENV === 'production'
;

let config = {
  devtool: 'source-map',
  entry: path.resolve('src', 'index.js'),

  output: {
    path: path.resolve('dist'),
    filename: IS_PRODUCTION
      ? 'JSMpeg.min.js'
      : 'JSMpeg.js',
    library: 'JSMpeg',
    libraryTarget: 'umd'
  },

  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('node_modules'),
    ],
    'extensions': ['.js'],
  },

  module: {
    rules: [
      // Scripts
      {
        test: /\.js$/,
        include: [
          path.resolve('src'),
        ],
        exclude: [
          path.resolve('node_modules'),
        ],
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [],
};

// Clean Dist Dir
if (!IS_PRODUCTION) {
  config.plugins.push(
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve('./'),
      verbose: true,
      dry: false,
    }),
  );
}

// Uglify Js
if (IS_PRODUCTION) {
  config.plugins.push(
    new UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        screw_ie8: true,
        warnings: false,
        drop_debugger: true,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
      sourceMap: true,
    }),
  );
}

module.exports = config;
