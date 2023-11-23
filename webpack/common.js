const path = require('path');
const { paths } = require('./utils');

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
        ]
    },
    
    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
        conditionNames: ['svelte', 'browser', 'module', 'main'],
        extensions: ['.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
};