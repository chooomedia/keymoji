const { merge } = require('webpack-merge');
const common = require('./common');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { paths } = require('./utils');

module.exports = merge(common, {
    mode: 'production', // Webpack setzt process.env.NODE_ENV = 'production'
    stats: 'errors-only',
    output: {
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
        path: paths.APP_BUILD_SRC,
        publicPath: '/',
        clean: true,
        compareBeforeEmit: true
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: true,
                            importLoaders: 1,
                            sourceMap: false,
                            modules: {
                                auto: true,
                                localIdentName: '[hash:base64:5]'
                            }
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024
                    }
                },
                generator: {
                    filename: 'static/images/[name].[contenthash:8][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/fonts/[name].[hash:8][ext]'
                }
            }
        ]
    },

    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log', 'console.warn'],
                        // SEO-optimierte Komprimierung
                        passes: 2,
                        unsafe: true,
                        unsafe_comps: true
                    },
                    format: {
                        comments: false
                    },
                    mangle: {
                        // Behalte wichtige Funktionen für SEO
                        reserved: ['__PRELOADED_STATE__', 'window', 'document']
                    }
                },
                extractComments: false,
                parallel: true
            }),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                            normalizeWhitespace: true,
                            colormin: true,
                            minifyFontValues: true
                        }
                    ]
                }
            })
        ],
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: 20,
            minSize: 20000,
            maxSize: 244000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(
                            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                        )[1];
                        return `npm.${packageName.replace('@', '')}`;
                    },
                    priority: 10,
                    reuseExistingChunk: true
                },
                common: {
                    minChunks: 2,
                    priority: 5,
                    reuseExistingChunk: true
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 20
                },
                // SEO-optimierte Chunks
                seo: {
                    name: 'seo',
                    test: /[\\/]src[\\/]utils[\\/]seo\.js/,
                    priority: 30,
                    reuseExistingChunk: true
                },
                routing: {
                    name: 'routing',
                    test: /[\\/]src[\\/]routes[\\/]/,
                    priority: 25,
                    reuseExistingChunk: true
                }
            }
        }
    },

    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ids.DeterministicModuleIdsPlugin({
            maxLength: 5
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            ignoreOrder: true
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'public',
                    to: '',
                    globOptions: {
                        ignore: ['**/index.html']
                    },
                    noErrorOnMissing: true
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
                // SEO-optimierte HTML-Komprimierung
                processConditionalComments: true,
                quoteCharacter: '"'
            },
            cache: true,
            // SEO-optimierte Meta-Tags
            meta: {
                viewport:
                    'width=device-width, initial-scale=1.0, user-scalable=yes',
                'theme-color': '#253852',
                'apple-mobile-web-app-capable': 'yes',
                'apple-mobile-web-app-status-bar-style': 'default'
            }
        }),
        new webpack.DefinePlugin({
            'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
            'process.env.NODE_ENV': JSON.stringify('production'),
            // SEO-optimierte globale Variablen
            __SEO_ENABLED__: JSON.stringify(true),
            __PRELOAD_ENABLED__: JSON.stringify(true)
        }),
        // Webpack 5 native optimizations
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 10000
        }),
        // SEO-optimierte Performance-Plugins
        new webpack.optimize.ModuleConcatenationPlugin()
    ],

    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        },
        compression: 'gzip',
        name: `production-cache`,
        version: `${Date.now()}`
    },

    // SEO-optimierte Performance-Einstellungen
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },

    // SEO-optimierte Source Maps
    devtool: 'source-map'
});
