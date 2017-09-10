 var path = require('path');
 var webpack = require('webpack');
     
 module.exports = {
    entry: './src/Core.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'parzen.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,

            }
        ]
    },
    node: {
        fs: 'empty'
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
 };