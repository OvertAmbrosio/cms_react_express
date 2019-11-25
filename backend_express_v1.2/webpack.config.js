const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    node: {
        fs: "empty"
     },

    entry: './app/index.js',
    output: {
        path: path.resolve(__dirname + '/public'),
        filename: 'bundle.js',
        publicPath: '/'
    },

    devServer: {
        historyApiFallback: true,
        port: 5000
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                exclude: /node_module/
            },
            {
                test: /\.(c|sc|sa)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|png|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'static/',
                            useRelativePath: true
                        }
                    }
                ]
            },

            {
                test: /\.(woff|woff2|ttf|eot|svg)$/,
                loader: 'file-loader',
                options: {
                  outputPath: 'webfonts',
                  name: '[name].[ext]',
                },
                exclude: /node_modules/,
              },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css'
        })
    ]
}