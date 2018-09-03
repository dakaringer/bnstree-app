const express = require('express')
const async = require('async')
const router = express.Router()

const db = require('../db').db

const uiText = db.collection('uiText')
const orders = db.collection('orders')
const users = db.collection('users')
const news = db.collection('news')

const oneDay = 86400000

const supportedLanguages = ['en', 'ko', 'ru']

router.post('/getUiData', (req, res) => {
    let lang = req.body.lang
    if (req.body.initial) {
        if (req.user && req.user.defaultLanguage) {
            lang = req.user.defaultLanguage
        }
        else if (req.session.defaultLanguage) {
            lang = req.session.defaultLanguage
        }
    }
    if (supportedLanguages.indexOf(lang) < 0) {
        lang = 'en'
    }

    if (req.user) {
        req.user.defaultLanguage = lang
        users.save(req.user)
    }

    setTimeout(function () {
        req.session.defaultLanguage = lang
        req.session.save()
    }, 200)

    async.parallel({
        ui: callback => uiText.find({}, {[lang]: 1}, (err, docs) => callback(null, docs)),
        orders: callback => orders.find({}, (err, docs) => callback(null, docs)),
    }, (err, results) => {
        results.lang = lang
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/loadNewsList', (req, res) => {
    let limit = req.body.limit || 5

    async.parallel({
        list: callback => news.find({}, {postedBy: 0}).sort({datePosted: -1}).skip(limit * (req.body.page - 1)).limit(limit, (err, docs) => callback(null, docs)),
        count: callback => news.count({}, (err, c) => callback(null, c))
    }, (err, results) => {
        results.page = req.body.page
        results.limit = limit
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/fetchArticle', (req, res) => {
    async.parallel({
        article: callback => news.findOne({'_id' : req.body.articleId}, {'postedBy': 0}, (err, doc) => callback(null, doc))
    }, (err, results) => {
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

module.exports = router
