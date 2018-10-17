const path = require('path')
const CssExtractPlugin = require('extract-css-chunks-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HTMLWebpackPlugin = require('html-webpack-plugin')

const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')
const SentryPlugin = require('@sentry/webpack-plugin')

const ROOT = process.cwd()

module.exports = merge(common, {
	mode: 'production',
	stats: {
		all: false,
		builtAt: true,
		timings: true,
		colors: true,
		errors: true,
		errorDetails: true
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				sourceMap: true,
				terserOptions: {
					compress: {
						drop_console: true
					}
				}
			})
		]
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: '!!raw-loader!' + path.join(ROOT, 'public', 'index.ejs'),
			filename: 'index.ejs'
		}),
		new CleanWebpackPlugin(['dist'], {
			root: ROOT,
			beforeEmit: true
		}),
		new CssExtractPlugin({
			filename: 'css/[name].[hash:8].css',
			chunkFilename: 'css/[id].[hash:8].css'
		}),
		new CompressionPlugin({ test: /\.(js|css)$/ }),
		new CopyWebpackPlugin([{ from: 'public' }]),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false
		}),
		new SentryPlugin({
			release: process.env.RELEASE || 'abcdefg',
			include: './dist',
			ignore: ['node_modules', 'webpack']
		})
	]
})
