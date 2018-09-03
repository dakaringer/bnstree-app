const webpack = require('webpack')

//import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin'
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    entry: [
        './src/app'
    ],
    output: {
        path: __dirname + '/public',
        filename: './app/[name].js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader?presets[]=react,presets[]=es2015']
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        { loader: 'postcss-loader', options: { plugins: [autoprefixer] } }
                    ]
                })
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        { loader: 'postcss-loader', options: { plugins: [autoprefixer] } },
                        'sass-loader'
                    ]
                })
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url-loader?limit=15000&name=images/[name].[ext]'
                ]
            }, {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=/css/fonts/[name].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                minimize: false,
                debug: true
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            async: true
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin({
            filename: '/css/style.css',
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin()
    ]
}
