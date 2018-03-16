import characterRenderer from './characterRenderer'
import articleRenderer from './articleRenderer'

const express = require('express')
const path = require('path')
const fs = require("fs")
const helmet = require('helmet')
const compression = require('compression')

const app = express()
const router = express.Router()
app.use(helmet())
app.use(compression())

let buildPath = process.env.NODE_ENV === 'production' ? 'build_final' : 'build'

app.use(express.static(
    path.resolve(__dirname, '..', buildPath),
    { maxAge: '30d' }
))

app.get('/character/:region/:name', characterRenderer)
app.get('/news/:id/*', articleRenderer)
app.get('*', (req, res, next) => {
    const filePath = path.resolve(__dirname, '..', buildPath, 'index.html')

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('err', err);
            return res.status(404).end()
        }

        return res.send(
            htmlData
        )
    })
})

app.use(router)

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log('Dev Server started.')
    })
} else {
    app.listen(3001, () => {
        console.log('Production Server started.')
    })
}