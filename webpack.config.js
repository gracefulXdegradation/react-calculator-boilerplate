const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: 'index.html',
});

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: ['babel-polyfill', './src/index.jsx'],
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            testutils: path.resolve(__dirname, './src/testutils'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'eslint-loader',
                ],
            },
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.jpg$/,
                use: [
                    'url-loader',
                ],
            },
            {
                test: /\.(ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'fonts',
                        name: '[name]-[hash].[ext]',
                    },
                },

            },
        ],
    },
    devServer: {
        historyApiFallback: true,
        port: 4000,
        disableHostCheck: true,
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'dist/[name].[hash].js',
    },
    plugins: [
        htmlPlugin,
        isProduction ? new (require('compression-webpack-plugin'))() : () => null,
    ],
};
