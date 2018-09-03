const path = require('path')
const Dotenv = require('dotenv-webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CssExtractPlugin = require('extract-css-chunks-webpack-plugin')

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
		modules: ['src', 'node_modules'],
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			'@src': path.join(ROOT, 'src')
		}
	},
	devtool: 'hidden-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										modules: false,
										targets: {
											browsers: ['> 1%']
										}
									}
								]
							],
							plugins: [
								'react-hot-loader/babel',
								'@babel/plugin-syntax-dynamic-import',
								'@babel/plugin-proposal-object-rest-spread',
								[
									'transform-imports',
									{
										'@material-ui/core': {
											transform: '@material-ui/core/${member}',
											preventFullImport: true
										},
										'@material-ui/core/colors': {
											transform: '@material-ui/core/colors/${member}',
											preventFullImport: true
										},
										'@material-ui/icons': {
											transform: '@material-ui/icons/${member}',
											preventFullImport: true
										}
									}
								]
							]
						}
					},
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					CssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: true,
							namedExport: true,
							camelCase: true,
							localIdentName: '[name]__[local]__[hash:8]',
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								require('postcss-import')({
									path: ['src/styles']
								}),
								require('postcss-preset-env')({
									stage: 0,
									features: {
										'custom-properties': {
											preserve: false
										}
									},
									autoprefixer: {
										grid: true
									}
								}),
								require('cssnano')
							]
						}
					}
				]
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
				loader: 'url-loader',
				options: {
					limit: 10000,
					fallback: 'file-loader',
					name: 'static/media/[name].[ext]'
				}
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
		new HTMLWebpackPlugin({
			template: path.join(ROOT, 'public', 'index.html')
		}),
		new Dotenv({
			silent: true
		})
	]
}
