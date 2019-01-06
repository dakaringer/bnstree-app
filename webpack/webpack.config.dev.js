const path = require('path')
const webpack = require('webpack')
const CssExtractPlugin = require('extract-css-chunks-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')

const ROOT = process.cwd()

module.exports = merge(common, {
	mode: 'development',
	devtool: 'eval-source-map',
	plugins: [
		new ManifestPlugin({
			writeToFileEmit: true,
			filter: fd => fd.isInitial
		}),
		new HTMLWebpackPlugin({
			template: path.join(ROOT, 'public', 'index.ejs'),
			templateParameters: {
				locals: {}
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new CssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
			hot: true
		})
	],
	devServer: {
		// stats: 'errors-only',
		contentBase: path.resolve(__dirname, 'dist'),
		hot: true,
		port: 4000,
		publicPath: '/',
		historyApiFallback: true
	}
})
