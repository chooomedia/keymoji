const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./common');
const { paths, plugins } = require('./utils');

module.exports = merge(common, {
    mode: 'development',
    stats: 'minimal',

    // DevServer v5 Konfiguration
    devServer: {
        allowedHosts: 'all',
        historyApiFallback: {
            // Alle Routen (inkl. /de, /de/account, etc.) auf index.html umleiten
            index: '/index.html',
            rewrites: [
                // Root route
                { from: /^\/$/, to: '/index.html' },
                // Language routes: /de, /de-CH, /de/account, etc.
                { from: /^\/[a-z]{2}(-[A-Z]{2})?(\/.*)?$/, to: '/index.html' },
                // All other routes
                { from: /./, to: '/index.html' }
            ]
        },
        client: {
            overlay: false,
            progress: true
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
        },
        // PERFORMANCE: Cache-Optimierung für Dev - verhindert Cache-Explosion
        compression: false, // Keine Komprimierung für Dev (schneller, weniger Speicher)
        maxAge: 1000 * 60 * 60 * 24, // 1 Tag Cache-Gültigkeit (kürzer für Dev)
        cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/webpack-dev'),
        // Cache-Größe limitieren - verhindert Cache-Explosion
        maxMemoryGenerations: 1, // Nur 1 Generation im Speicher
        // Cache-Management: Automatisches Cleanup alter Caches
        idleTimeout: 2000, // 2 Sekunden Idle-Timeout
        idleTimeoutForInitialStore: 10000 // 10 Sekunden für initialen Store
    },

    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        // PERFORMANCE: Lightweight splitChunks für Dev - ermöglicht Chunk-Loading-Tracking
        // Best Practice: Nur async chunks (dynamische Imports) trennen, nicht alle Routes
        splitChunks: {
            chunks: 'async', // Nur async chunks (dynamische Imports) - verhindert Progress Bar Hängen
            maxInitialRequests: 30, // Erhöht für besseres Chunk-Tracking
            minSize: 0, // Keine Mindestgröße für Dev
            cacheGroups: {
                // Vendor-Chunk für node_modules (bessere HMR Performance)
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: 10,
                    reuseExistingChunk: true,
                    chunks: 'async' // Nur async chunks
                },
                // Svelte Framework separat (bessere HMR Performance)
                svelte: {
                    test: /[\\/]node_modules[\\/]svelte[\\/]/,
                    name: 'svelte',
                    priority: 20,
                    reuseExistingChunk: true,
                    chunks: 'async'
                }
            }
        }
    }
});
