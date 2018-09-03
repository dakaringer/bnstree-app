const express = require('express')
const async = require('async')
const router = express.Router()
const shortid = require('shortid')

const passport = require('passport')

const oneDay = 86400000

const db = require('../db').db
const news = db.collection('news')

router.get('/login', (req, res) => {
    req.session.redirectUrl = req.query.r
    res.redirect('/auth/google')
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
}))

router.get('/auth/google/return', passport.authenticate('google', {failureRedirect: '/'}), function(req, res) {
    res.redirect(req.session.redirectUrl || '/')
})

router.post('/verify', (req, res) => {
    if (req.user) {
        if (req.body.articleId && req.user.admin) {
            async.parallel({
                article: callback => news.findOne({'_id' : req.body.articleId}, {'postedBy': 0}, (err, doc) => callback(null, doc))
            }, (err, results) => {
                results.admin = 1
                res.setHeader('Cache-Control', `max-age=${oneDay}`)
                res.send(results)
            })
        }
        else {
            res.send({
                admin: req.user.admin
                    ? 1
                    : 0
            })
        }
    } else {
        res.send({admin: 0})
    }
})

router.post('/post', (req, res) => {
    if (req.user.admin) {
        let article = {
            _id: req.body.id,
            title: req.body.title,
            subtitle: req.body.subtitle,
            content: req.body.content,
            thumb: req.body.thumb,
            datePosted: new Date(),
            postedBy: req.user._id
        }

        if (!article._id || article._id == '') {
            article._id = shortid.generate()
        }

        news.save(article, (err, doc) => {
            if (err) {
                res.send({success: 0})
            } else {
                res.send({success: 1, id: doc._id})
            }
        })
    }
    else {
        res.send({success: 0})
    }
})

router.post('/delete', (req, res) => {
    if (req.user.admin) {
        news.remove({_id: req.body.id}, function(err) {
            if (err) {
                res.send({success: 0})
            } else {
                res.send({success: 1})
            }
        })
    }
    else {
        res.send({success: 0})
    }
})

const rankingInfo = db.collection('rankingInfo')
router.get('/resetArenaSeason', (req, res) => {
    if (req.user.admin) {
        rankingInfo.find({}).forEach((err, doc) => {
            if (doc) {
                rankingInfo.update({_id: doc._id}, {$set: {
                    solo: 1300,
                    tag: 1300,
                    previousSeasonSolo: doc.solo,
                    previousSeasonTag: doc.tag
                }})
            }
        })
    }
    res.redirect('/')
})

/* GET home page. */
router.get('*', function(req, res) {
    req.session.redirectUrl = null
    let user = null
    if (req.user) {
        user = {
            displayName: req.user.displayName,
            profilePic: req.user.profilePic
        }

        if (req.user.admin) {
            user.admin = true
        }
    }
    res.render('index', {
        title: 'BnSTree',
        env: process.env.NODE_ENV === 'production' || process.env.WEBPACK_DEV_OFF,
        user: user
    })
})

module.exports = router
