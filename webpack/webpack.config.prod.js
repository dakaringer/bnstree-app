const webpack = require('webpack')
const CssExtractPlugin = require('extract-css-chunks-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')
const SentryPlugin = require('@sentry/webpack-plugin')

const ROOT = process.cwd()

module.exports = merge(common, {
	mode: 'production',
	optimization: {
		minimizer: [
			new UglifyJSWebpackPlugin({
				sourceMap: true,
				uglifyOptions: {
					comments: false,
					compress: {
						drop_console: true
					}
				}
			})
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: ROOT,
			beforeEmit: true
		}),
		new CssExtractPlugin({
			filename: 'css/[name].[hash:8].css',
			chunkFilename: 'css/[id].[hash:8].css'
		}),
		new CompressionPlugin({ test: /\.(js|css)$/ }),
		new webpack.EnvironmentPlugin(['SENTRY_DSN', 'GOOGLE_CLIENT_ID', 'GA_TRACKER']),
		new CopyWebpackPlugin([{ from: 'public' }]),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false
		}),
		new SentryPlugin({
			release: 'v6.0.0',
			include: './dist',
			ignore: ['node_modules', 'webpack']
		})
	]
})
