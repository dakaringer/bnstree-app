const path = require('path')
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')

const character = require('./withMetadata/character')

const PORT = 4000
const BUILD_FOLDER = '../dist'

const app = express()
app.set('view engine', 'ejs')
app.use(helmet())
app.use(compression())

app.use(express.static(path.resolve(__dirname, BUILD_FOLDER), { maxAge: '30d' }))
app.get('/character/:region/:name', character)
app.get('*', (_req, res) => res.render(path.resolve(__dirname, BUILD_FOLDER, 'index.ejs')))

app.listen(PORT, () => {
	console.log(`Server started. Listening on port ${PORT}`)
})
