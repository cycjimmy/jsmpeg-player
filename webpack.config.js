let
  path = require('path')
;

module.exports = {
  devtool: 'source-map',
  entry: path.resolve('src', 'index.js'),

  output: {
    path: path.resolve('dist'),
    filename: 'JSMpeg.js',
    library: 'JSMpeg',
    libraryTarget: 'umd'
  },

  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('node_modules'),
    ],
    'extensions': ['.js']
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
};