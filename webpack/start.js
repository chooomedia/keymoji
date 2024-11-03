const { merge } = require('webpack-merge');
const common = require('./common');
const { paths, plugins } = require('./utils');

module.exports = merge(common, {
  mode: 'development',
  stats: 'minimal',
  
  // DevServer-Konfiguration optimiert
  devServer: {
    allowedHosts: 'all',
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      },
      progress: true
    },
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    historyApiFallback: true,
    hot: true,
    open: true,
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost',
    static: {
      directory: paths.APP_PUBLIC,
      publicPath: '/'
    }
  },

  // Output-Konfiguration vereinfacht
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: paths.APP_BUILD_SRC,
    publicPath: '/',
  },

  // Module-Rules optimiert
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }
    ]
  },

  plugins: plugins.start,

  // Optimierte Source Maps für Entwicklung
  devtool: 'eval-cheap-module-source-map',

  // Cache-Konfiguration für schnellere Rebuilds
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },

  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  }
});