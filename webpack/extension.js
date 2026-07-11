const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const rootDir = path.resolve(__dirname, '..');

module.exports = {
    mode: 'production',
    target: 'web',
    entry: {
        popup: path.resolve(rootDir, 'src/extension/popup/popup.ts'),
        contentScript: path.resolve(
            rootDir,
            'src/extension/content/contentScript.ts'
        )
    },
    output: {
        filename: '[name].js',
        path: path.resolve(rootDir, 'build-extension'),
        clean: true,
        publicPath: '',
        globalObject: 'self'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
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
                                resolveJsonModule: true
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        fullySpecified: false
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(rootDir, 'src/extension/static'),
                    to: path.resolve(rootDir, 'build-extension')
                }
            ]
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    },
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            })
        ]
    },
    devtool: false
};
