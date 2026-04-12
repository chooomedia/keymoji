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
                        compilerOptions: {
                            dev: process.env.NODE_ENV !== 'production',
                            generate: 'dom',
                            // Ensure we're using Svelte 3 APIs
                            format: 'esm'
                        },
                        preprocess: require('svelte-preprocess')({
                            typescript: {
                                tsconfigFile: './tsconfig.json',
                                compilerOptions: {
                                    module: 'ESNext',
                                    moduleResolution: 'node',
                                    esModuleInterop: true,
                                    allowSyntheticDefaultImports: true
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
                // Allow .js files to import .ts files
                type: 'javascript/auto'
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            compilerOptions: {
                                module: 'ESNext',
                                target: 'ES2020',
                                moduleResolution: 'node',
                                esModuleInterop: true,
                                allowSyntheticDefaultImports: true,
                                resolveJsonModule: true,
                                isolatedModules: false
                            }
                        }
                    }
                ]
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
            svelte: path.resolve(__dirname, '..', 'node_modules', 'svelte'),
            // CRITICAL: svelte/store Alias für Svelte 3 Kompatibilität
            // modalStore.ts und andere Stores benötigen diesen Import
            'svelte/store': path.resolve(
                __dirname,
                '..',
                'node_modules',
                'svelte',
                'store',
                'index.js'
            ),
            // Direct alias for appStores to ensure TypeScript file is resolved
            // This works around svelte-loader not properly forwarding TypeScript imports to Webpack
            'stores/appStores': path.resolve(
                __dirname,
                '..',
                'src',
                'stores',
                'appStores.ts'
            ),
            'stores/bannerStore': path.resolve(
                __dirname,
                '..',
                'src',
                'stores',
                'bannerStore.ts'
            )
        },
        conditionNames: ['svelte', 'browser', 'module', 'main'],
        // IMPORTANT: .ts must be FIRST to ensure TypeScript files are resolved
        extensions: ['.ts', '.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        // Ensure Svelte internal modules are resolved correctly
        modules: [
            path.resolve(__dirname, '..', 'src'),
            path.resolve(__dirname, '..', 'node_modules'),
            'node_modules'
        ],
        // Symlinks should be resolved
        symlinks: false,
        // Ensure TypeScript files are resolved correctly
        fullySpecified: false
    }
};
