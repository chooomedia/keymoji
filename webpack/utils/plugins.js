const environment = require('./environment');
const paths = require('./paths');

const plugins = {
    Clean: require('clean-webpack-plugin').CleanWebpackPlugin,
    Define: require('webpack').DefinePlugin,
    Html: require('html-webpack-plugin'),
    MiniCSSExtract: require('mini-css-extract-plugin'),
    CopyWebpack: require('copy-webpack-plugin')
};

module.exports = {
    common: [],
    start: [
        new plugins.Define({
            'process.env.OPENAI_API_KEY': environment.development.OPENAI_API_KEY,
            'process.env': JSON.stringify(environment.development)
        }),
        new plugins.Html({
            inject: true,
            template: paths.APP_HTML,
            title: 'Keymoji - Development'
        })
    ],
    build: [
        new plugins.Clean(),
        new plugins.MiniCSSExtract({
            filename: 'static/css/[name].[chunkhash:8].css',
            chunkFilename: 'static/css/[id].[chunkhash:8].css'
        }),
        new plugins.Html({
            inject: 'body',
            template: paths.APP_HTML,
            title: 'Keymoji',
            minify: {
                collapseWhitespace: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeRedundantAttributes: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true
            }
        }),
        new plugins.Define({
            'process.env.OPENAI_API_KEY': environment.production.OPENAI_API_KEY,
            'process.env': JSON.stringify(environment.production)
        }),
        new plugins.CopyWebpack({
            patterns: [
                {
                    from: 'public',
                    to: '',
                    globOptions: {
                        ignore: [
                            '**/index.html',
                            '**/.DS_Store',
                            '**/Thumbs.db'
                        ]
                    }
                }
            ]
        })
    ]
};