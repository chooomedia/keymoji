const { merge } = require('webpack-merge');
const common = require('./common');
const { paths, plugins } = require('./utils');

module.exports = merge(common, {
  mode: 'development',
  stats: 'minimal',
  devServer: {
    allowedHosts: 'all', // Erlaubt den Zugriff von allen Hosts
    client: {
      overlay: false, // Setzt overlay auf false, um Fehler nicht als Overlay anzuzeigen
    },
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*', // Erlaubt Cross-Origin-Anfragen
    },
    historyApiFallback: true,
    hot: true, // Aktiviert Hot Module Replacement (HMR)
    liveReload: true, // Aktiviert Live-Reload
    open: true, // Öffnet die Anwendung automatisch im Standardbrowser
    port: 8080, // Port, auf dem der Dev Server läuft
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
    ],
  },
  plugins: plugins.start,
});