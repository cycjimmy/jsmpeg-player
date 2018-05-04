var
  path = require('path')

  // webpack plugin
  , BrowserSyncPlugin = require('browser-sync-webpack-plugin')
  , HtmlWebpackPlugin = require('html-webpack-plugin')
  , UglifyJsPlugin = require('uglifyjs-webpack-plugin')
  , CleanWebpackPlugin = require('clean-webpack-plugin')
;

var
  IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
  , IS_PRODUCTION = process.env.NODE_ENV === 'production'
  , cssIdentifier = IS_PRODUCTION ? '[hash:base64:10]' : '[path][name]__[local]'
;

var config = {
  mode: 'none',
  entry: path.resolve('src', 'index.js'),

  output: {
    path: IS_DEVELOPMENT
      ? path.resolve('dist')
      : path.resolve('build'),
    filename: IS_PRODUCTION
      ? 'JSMpeg.min.js'
      : 'JSMpeg.js',
    library: 'JSMpeg',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },

  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('node_modules')
    ],
    'extensions': ['.js']
  },

  module: {
    rules: [
      // Scripts
      {
        test: /\.js$/,
        type: 'javascript/auto',
        include: [
          path.resolve('src'),
        ],
        exclude: [
          path.resolve('node_modules'),
        ],
        loader: 'babel-loader'
      },

      // Style
      {
        test: /\.scss$/,
        exclude: [
          path.resolve('node_modules'),
        ],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true,
              localIdentName: cssIdentifier,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
            },
          },
        ]
      },

      // Pug template
      {
        test: /\.pug$/,
        include: [
          path.resolve('src'),
          path.resolve('static')
        ],
        exclude: [
          path.resolve('node_modules')
        ],
        loader: 'pug-loader'
      },

      // media
      {
        test: /\.(wav|mp3|mpeg|mp4|webm|ogv|flv|ts)$/i,
        exclude: [
          path.resolve('node_modules')
        ],
        include: [
          path.resolve('static', 'media')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'media/[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: []
};

// dev mode
if (IS_DEVELOPMENT) {
  config.mode = 'development';

  // devtool
  config.devtool = 'source-map';

  config.plugins.push(
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve('./static', 'view', 'index.pug'),
    }),

    new CleanWebpackPlugin(['dist'], {
      root: path.resolve('./'),
      verbose: true,
      dry: false
    }),

    new BrowserSyncPlugin({
      server: {
        baseDir: 'dist',
      },
    }, {
      reload: true,
    })
  );
}

// production mode
if (IS_PRODUCTION) {
  config.mode = 'production';

  config.plugins.push(
    new CleanWebpackPlugin(['build'], {
      root: path.resolve('./'),
      verbose: true,
      dry: false
    }),

    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 5,
        output: {
          comments: false,
          beautify: false
        },
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true
        },
        warnings: false,
        sourceMap: true
      }
    })
  );
}

module.exports = config;
