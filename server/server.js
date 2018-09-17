const path = require('path')
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const fs = require('fs')

const PORT = 4000
const BUILD_FOLDER = '../dist'

const app = express()
app.use(helmet())
app.use(compression())

app.use(express.static(path.resolve(__dirname, BUILD_FOLDER), { maxAge: '30d' }))
app.get('*', (_req, res) => {
	const filePath = path.resolve(__dirname, BUILD_FOLDER, 'index.html')

	fs.readFile(filePath, 'utf8', (err, htmlData) => {
		if (err) {
			console.error('err', err)
			return res.status(404).end()
		}

		return res.send(htmlData)
	})
})

app.listen(PORT, () => {
	console.log(`Server started. Listening on port ${PORT}`)
})
