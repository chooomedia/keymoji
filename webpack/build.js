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
    mode: 'production',
    stats: 'errors-only',
    output: {
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
        path: paths.APP_BUILD_SRC,
        publicPath: '/',
        clean: true,
        compareBeforeEmit: true // Verhindert doppelte Asset-Emission
    },
    
    // Optimierte Modul-Regeln
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true,
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
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
                        maxSize: 8 * 1024 // 8kb
                    }
                },
                generator: {
                    filename: 'static/images/[name].[contenthash:8][ext]'
                }
            }
        ]
    },

    // Optimierte Chunk-Konfiguration
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
                        pure_funcs: ['console.log']
                    },
                    format: {
                        comments: false
                    },
                    mangle: true
                },
                extractComments: false,
                parallel: true
            }),
            new CssMinimizerPlugin()
        ],
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: 20,
            minSize: 20000,
            maxSize: 244000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(
                            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                        )[1];
                        return `vendor.${packageName.replace('@', '')}`;
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
                }
            }
        }
    },

    // Optimierte Plugins
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ids.HashedModuleIdsPlugin(),
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
                minifyURLs: true
            },
            cache: true
        }),
        new webpack.DefinePlugin({
            'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString())
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        // Verhindert doppelte Module
        new webpack.optimize.DedupePlugin()
    ],

    // Cache-Konfiguration
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        },
        compression: 'gzip'
    }
});