const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const extractLess = new ExtractTextPlugin({
    filename: "style.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: './src/javascript/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devtool: (process.env.NODE_ENV === "development") && 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 9000,
        proxy: {
            "/gettext": "http://localhost:3000",
            "/movie": "http://localhost:3000"
        }
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2|ico)$/, use: ['url-loader']
            },
            {
                test: /\.less$/,
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            }

        ]
    },
    plugins: [
        // new CleanWebpackPlugin(['public/*.*']),
        extractLess,
        new HtmlWebpackPlugin({
            title: 'My App',
            favicon: 'src/images/favicon.ico',
            filename: 'index.html',
            template: 'views/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
};