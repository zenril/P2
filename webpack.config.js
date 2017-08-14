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
                query: {
                    presets: ['es2015', 'es2016']
                }
            }
        ]
    },
    plugins: [
        
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map'
 };