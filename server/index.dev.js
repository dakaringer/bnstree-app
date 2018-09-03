const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackconfig = require('../webpack.dev.config.js')
let webpackcompiler = webpack(webpackconfig)

//enable webpack middleware for hot-reloads in development
function useWebpackMiddleware(app) {
    console.log(webpackconfig.output.publicPath)
    app.use(webpackDevMiddleware(webpackcompiler, {
        publicPath: webpackconfig.output.publicPath,
        stats: {
            colors: true,
            chunks: false, // this reduces the amount of stuff I see in my terminal; configure to your needs
            'errors-only': true
        }
    }))
    app.use(webpackHotMiddleware(webpackcompiler, {log: console.log}))

    return app
}

module.exports = {
    useWebpackMiddleware: useWebpackMiddleware
}
