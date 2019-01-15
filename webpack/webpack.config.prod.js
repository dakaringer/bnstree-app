const path = require('path')
const CssExtractPlugin = require('extract-css-chunks-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')
const SentryPlugin = require('@sentry/webpack-plugin')

const ROOT = process.cwd()

module.exports = merge(common, {
	mode: 'production',
	devtool: 'hidden-source-map',
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
		],
		splitChunks: {
			chunks: 'all'
		}
	},
	plugins: [
		new ManifestPlugin({
			writeToFileEmit: true,
			seed: {
				name: 'BnSTree',
				short_name: 'BnSTree',
				icons: [
					{
						src: '/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/android-chrome-256x256.png',
						sizes: '256x256',
						type: 'image/png'
					}
				],
				start_url: './',
				display: 'standalone',
				theme_color: '#222222',
				background_color: '#222222'
			},
			filter: fd => fd.isInitial
		}),
		new HTMLWebpackPlugin({
			template: '!!raw-loader!' + path.join(ROOT, 'public', 'index.ejs'),
			filename: 'index.ejs',
			minify: {
				removeComments: true,
				collapseWhitespace: true
			}
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
			release: process.env.RELEASE || 'test',
			include: './dist',
			ignore: ['node_modules', 'webpack'],
			dryRun: !process.env.RELEASE
		})
	]
})
