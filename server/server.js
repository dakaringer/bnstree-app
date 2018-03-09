import serverRenderer from './renderer'

const express = require('express')
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')

const app = express()
const router = express.Router()
app.use(helmet())
app.use(compression())

app.get('/character/:region/:name', serverRenderer)

let buildPath = process.env.NODE_ENV === 'production' ? './build_final' : './build'
app.use(express.static(path.join(__dirname, '..', buildPath)))

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