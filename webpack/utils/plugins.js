const environment = require('./environment');
const paths = require('./paths');

const plugins = {
    Clean: require('clean-webpack-plugin').CleanWebpackPlugin,
    Define: require('webpack').DefinePlugin,
    Html: require('html-webpack-plugin'),
    MiniCSSExtract: require('mini-css-extract-plugin'),
    CopyWebpack: require('copy-webpack-plugin')
};

// Hilft dabei, Umgebungsvariablen korrekt in den Browser zu bringen
function createEnvForDefinePlugin(env) {
    const processEnv = {};

    // Konvertiere alle Umgebungsvariablen in das korrekte Format
    for (const key in env) {
        if (typeof env[key] === 'string') {
            processEnv[key] = JSON.stringify(env[key]);
        } else {
            processEnv[key] = env[key];
        }
    }

    return { 'process.env': processEnv };
}

module.exports = {
    common: [],
    start: [
        new plugins.Define(createEnvForDefinePlugin(environment.development)),
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
        new plugins.Define(createEnvForDefinePlugin(environment.production)),
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
