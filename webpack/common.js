const path = require('path');
const webpack = require('webpack');
const { paths } = require('./utils');
const setupFonts = require('./utils/setup-fonts');

setupFonts();

module.exports = {
    entry: {
        app: paths.APP_ENTRY_POINT
    },
    module: {
        rules: [
            {
                test: /\.svelte$/,
                exclude: /\.svelte\.ts$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        hotReload: true,
                        // Wichtig für dynamische Imports und Code Splitting
                        resolve: {
                            fullySpecified: false
                        },
                        compilerOptions: {
                            runes: true,
                            // Svelte 5: Generiere Code für Browser
                            generate: 'dom',
                            dev: process.env.NODE_ENV !== 'production'
                        },
                        preprocess: require('svelte-preprocess')({
                            typescript: {
                                tsconfigFile: './tsconfig.json',
                                compilerOptions: {
                                    module: 'ESNext',
                                    moduleResolution: 'node',
                                    skipLibCheck: true,
                                    transpileOnly: true,
                                    noEmit: true,
                                    // Less strict type checking for faster compilation
                                    strict: false,
                                    noImplicitAny: false
                                }
                            },
                            postcss: {
                                plugins: [
                                    require('tailwindcss'),
                                    require('autoprefixer')
                                ]
                            }
                        })
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ],
                type: 'javascript/auto'
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|\.svelte\.ts$)/,
                // .svelte.ts Dateien werden vom svelte-loader verarbeitet
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            compilerOptions: {
                                module: 'ESNext'
                            }
                        }
                    }
                ]
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
    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte'),
            // Svelte 5 Store-Export für Browser
            'svelte/store': path.resolve('node_modules', 'svelte', 'src', 'store', 'index-client.js'),
            // Svelte 5 interne Module explizit auflösen
            'svelte/internal': path.resolve('node_modules', 'svelte', 'src', 'internal'),
            'svelte/internal/disclose-version': path.resolve('node_modules', 'svelte', 'src', 'internal', 'disclose-version.js'),
            'svelte/internal/client': path.resolve('node_modules', 'svelte', 'src', 'internal', 'client', 'index.js')
        },
        conditionNames: ['svelte', 'browser', 'import', 'module', 'main'],
        extensions: ['.ts', '.mjs', '.js', '.svelte', '.jsx'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        fullySpecified: false,
        // Unterstützung für dynamische Imports (Code Splitting)
        preferRelative: false,
        modules: ['node_modules', path.resolve('src'), path.resolve('.')],
        symlinks: false
    },
    plugins: [
        // Webpack-Plugin um Svelte 5 interne Module korrekt aufzulösen
        new webpack.NormalModuleReplacementPlugin(
            /^svelte\/internal\/disclose-version$/,
            path.resolve('node_modules', 'svelte', 'src', 'internal', 'disclose-version.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
            /^svelte\/internal\/client$/,
            path.resolve('node_modules', 'svelte', 'src', 'internal', 'client', 'index.js')
        ),
        // Webpack-Plugin um svelte/store korrekt aufzulösen
        new webpack.NormalModuleReplacementPlugin(
            /^svelte\/store$/,
            path.resolve('node_modules', 'svelte', 'src', 'store', 'index-client.js')
        ),
        // Webpack-Plugin: Stelle sicher dass Runes auch in .ts Dateien verfügbar sind
        // Runes werden durch index-client.js als globale Funktionen definiert
        // Wir müssen sicherstellen, dass index-client.js vor den Store-Dateien geladen wird
        new (require('./utils/svelte-runes-plugin'))()
    ]
};
