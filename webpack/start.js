const { merge } = require('webpack-merge');
const common = require('./common');
const { paths, plugins } = require('./utils');

module.exports = merge(common, {
  mode: 'development',
  stats: 'minimal',
  devServer: {
    allowedHosts: 'all',
    client: {
      overlay: false,
    },
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    hot: true,
    liveReload: true,
    open: true,
    port: 8080,
    host: '192.168.178.20',
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: paths.APP_BUILD_SRC,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.node$/,
        loader: 'file-loader'
      },
    ],
  },
  plugins: plugins.start,
  resolve: {
    fallback: {
      "child_process": false,
      "fs": false,
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/")
    }
  }
});
