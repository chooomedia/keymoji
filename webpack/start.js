const { merge } = require('webpack-merge');
const common = require('./common');
const { paths, plugins } = require('./utils');

module.exports = merge(common, {
    mode: 'development',
    stats: 'minimal',

    // DevServer-Konfiguration mit deaktiviertem Overlay
    devServer: {
        allowedHosts: 'all',
        historyApiFallback: true,
        client: {
            overlay: false, // WICHTIG: Overlay komplett deaktiviert
            progress: true,
            logging: 'info'
        },
        compress: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
                'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers':
                'X-Requested-With, content-type, Authorization'
        },
        hot: true,
        open: true,
        port: process.env.PORT || 8080,
        host: process.env.HOST || 'localhost',
        static: {
            directory: paths.APP_PUBLIC,
            publicPath: '/',
            watch: true
        },
        devMiddleware: {
            writeToDisk: true
        }
    },

    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        path: paths.APP_BUILD_SRC,
        publicPath: '/'
    },

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
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            }
        ]
    },

    plugins: plugins.start,
    devtool: 'eval-cheap-module-source-map',

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
