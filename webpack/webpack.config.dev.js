const path = require('path')
const webpack = require('webpack')
const CssExtractPlugin = require('extract-css-chunks-webpack-plugin')

const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new CssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
			hot: true
		})
	],
	devServer: {
		stats: 'errors-only',
		contentBase: path.resolve(__dirname, 'dist'),
		hot: true,
		port: 4000,
		publicPath: '/',
		historyApiFallback: true
	}
})
