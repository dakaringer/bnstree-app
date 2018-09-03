const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = {
    entry: [
        'webpack/hot/dev-server', 'webpack-hot-middleware/client', './src/app'
    ],
    output: {
        path: '/',
        filename: './app/[name].js',
        publicPath: 'http://localhost:3000/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader?presets[]=react,presets[]=es2015']
            }, {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { plugins: [autoprefixer] } }
                ]
            }, {
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { plugins: [autoprefixer] } },
                    'sass-loader'
                ]
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
        new webpack.HotModuleReplacementPlugin()
    ]
}
