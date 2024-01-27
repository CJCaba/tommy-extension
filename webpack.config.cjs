const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    target: 'web',
    entry: {
        background: './src/chrome/background/index.ts',
        contentScripts: './src/chrome/contentScripts/index.ts',
        functionCalling: "./src/chrome/functionCalling/index.ts",
        react: './src/react/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
        publicPath: '',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: false
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve('manifest.json'),
                to: path.resolve('dist')
            }]
        })
    ],
    module: {
        rules: [
            {
                test: /.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', {'runtime': 'automatic'}],
                            '@babel/preset-typescript'
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx']
    }
};