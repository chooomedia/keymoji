const path = require('path');
const { paths } = require('./utils');
const setupFonts = require('./utils/setup-fonts');

// Setup the font directories before webpack runs
setupFonts();

module.exports = {
    entry: {
        app: paths.APP_ENTRY_POINT
    },
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        hotReload: true,
                        preprocess: require('svelte-preprocess')({})
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                // Add font file handling
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/fonts/[name].[hash:8][ext]'
                }
            }
        ]
    },

    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
        conditionNames: ['svelte', 'browser', 'module', 'main'],
        extensions: ['.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    }
};
