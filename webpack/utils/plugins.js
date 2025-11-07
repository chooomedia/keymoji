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
// Unterstützt sowohl process.env.* als auch import.meta.env.* (Vite-Stil)
function createEnvForDefinePlugin(env) {
    const processEnv = {};
    const importMetaEnv = {};

    // Konvertiere alle Umgebungsvariablen in das korrekte Format
    // Entferne NODE_ENV, da es bereits durch webpack.DefinePlugin.__definierte__ gesetzt wird
    for (const key in env) {
        if (key !== 'NODE_ENV') {
            let value = env[key];
            
            // Handle stringified values (from webpack/utils/environment.js)
            // If value is already a JSON string (starts and ends with quotes), parse it first
            if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // If parsing fails, use as-is
                }
            }
            
            const stringified = typeof value === 'string' 
                ? JSON.stringify(value) 
                : value;
            
            // Alle Variablen für process.env
            processEnv[key] = stringified;
            
            // VITE_* Variablen auch für import.meta.env (Vite-Stil)
            if (key.startsWith('VITE_')) {
                importMetaEnv[key] = stringified;
            }
        }
    }

    // Erstelle DefinePlugin-Konfiguration
    const defineConfig = {
        'process.env': processEnv
    };
    
    // Füge import.meta.env hinzu (nur wenn VITE_ Variablen vorhanden)
    // Webpack DefinePlugin benötigt ein verschachteltes Objekt-Format
    if (Object.keys(importMetaEnv).length > 0) {
        // Erstelle verschachteltes Objekt: import.meta.env.VITE_*
        const importMetaEnvObj = {};
        for (const key in importMetaEnv) {
            importMetaEnvObj[key] = importMetaEnv[key];
        }
        defineConfig['import.meta.env'] = JSON.stringify(importMetaEnvObj);
    }
    
    return defineConfig;
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
