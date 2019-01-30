const path = require('path')
const Dotenv = require('dotenv-webpack')

const ROOT = process.cwd()

module.exports = {
	entry: {
		global: path.join(ROOT, 'src', 'index')
	},
	output: {
		filename: 'js/[name].[hash:8].js',
		chunkFilename: 'js/[name].[hash:8].chunk.js',
		path: path.join(ROOT, 'dist'),
		publicPath: '/'
	},
	resolve: {
		modules: ['node_modules'],
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			'@src': path.join(ROOT, 'src'),
			'@components': path.join(ROOT, 'src', 'components'),
			'@store': path.join(ROOT, 'src', 'store'),
			'@style': path.join(ROOT, 'src', 'style'),
			'@utils': path.join(ROOT, 'src', 'utils')
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ['react-hot-loader/webpack', 'babel-loader']
			},
			{
				test: /\.(eot|woff|woff2|ttf)$/,
				loader: 'file-loader',
				options: {
					name: 'static/font/[name].[ext]'
				}
			},
			{
				test: /\.(gif|jpe?g|png)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1024 * 10,
							name: 'media/[name].[ext]'
						}
					},
					{
						loader: 'image-webpack-loader',
						options: {
							disable: true
						}
					}
				]
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: 'react-svg-loader',
						options: {
							svgo: {
								plugins: [{ cleanupAttrs: true }]
							}
						}
					}
				]
			}
		]
	},
	plugins: [
		new Dotenv({
			silent: true
		})
	]
}
