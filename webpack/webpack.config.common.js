const path = require('path')
const Dotenv = require('dotenv-webpack')
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
		modules: ['node_modules'],
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			'@src': path.join(ROOT, 'src')
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					'react-hot-loader/webpack',
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
										},
										useBuiltIns: 'usage'
									}
								],
								'@babel/preset-react',
								'@babel/preset-typescript'
							],
							plugins: [
								'@babel/plugin-proposal-class-properties',
								'@babel/plugin-syntax-dynamic-import',
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
