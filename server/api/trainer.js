const express = require('express')
const async = require('async')
const router = express.Router()
const shortid = require('shortid')

const db = require('../db').db
const skillTree = db.collection('skillTrees')
const skillList = db.collection('skillListItems')
const skillRef = db.collection('skillReferences')
const skillAttb = db.collection('skillAttributes')
const skillSubAttb = db.collection('skillSubAttributes')
const skillTags = db.collection('skillTags')
const skillVariables = db.collection('skillVariables')
const skillPatchNames = db.collection('skillPatchNames')
const users = db.collection('users')

const skillBuilds = db.collection('skillBuilds')

const oneDay = 86400000

router.post('/getTextData', (req, res) => {
    let lang = req.body.lang
    async.parallel({
        ref: callback => skillRef.aggregate([
            {
                $project: {
                    name: `$name.${lang}`,
                    icon: '$icon'
                }
            }
        ], (err, docs) => callback(null, docs)),
        attb: callback => skillAttb.aggregate([
            {
                $project: {
                    template: `$template.${lang}`
                }
            }
        ], (err, docs) => callback(null, docs)),
        subAttb: callback => skillSubAttb.aggregate([
            {
                $project: {
                    template: `$template.${lang}`,
                    icon: '$icon'
                }
            }
        ], (err, docs) => callback(null, docs)),
        tags: callback => skillTags.aggregate([
            {
                $project: {
                    name: `$name.${lang}`,
                    desc: `$desc.${lang}`
                }
            }
        ], (err, docs) => callback(null, docs)),
        variables: callback => skillVariables.find({}, {[lang]: 1}, (err, docs) => callback(null, docs)),
        patchNames: callback => skillPatchNames.find({}, (err, docs) => callback(null, docs))
    }, (err, results) => {
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/getClassData', (req, res) => {
    let jobCode = req.body.jobCode
    let mode = req.session.viewMode
    if (req.user && req.user.mode) {
        mode = req.user.mode
    }

    let match = {
        _id: new RegExp(`^${jobCode}.*`)
    }

    async.parallel({
        list: callback => skillList.find(match, (err, docs) => callback(null, docs)),
        tree: callback => skillTree.find(match, (err, docs) => callback(null, docs))
    }, (err, results) => {
        results.mode = mode || 'SHOW_LIST'
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
    // name, icon, tree, list, attributes
})

router.post('/loadBuildList', (req, res) => {
    async.parallel({
        list: callback => skillBuilds.find({unlisted: false, job: req.body.job}, {unlisted: 0}).sort({created: -1}).skip(req.body.limit * (req.body.page - 1)).limit(req.body.limit, (err, docs) => {
            async.map(docs, (doc, cb) => {
                users.findOne({_id: doc.postedBy}, {displayName: 1, profilePic: 1}, (err, user) => {
                    let d = doc
                    if (user) {
                        d.postedBy = {
                            displayName: user.displayName,
                            profilePic: user.profilePic
                        }
                    }
                    cb(null, d)
                })
            }, (err, results) => callback(null, results))
        }),
        count: callback => skillBuilds.count({unlisted: false, job: req.body.job}, (err, c) => callback(null, c))
    }, (err, results) => {
        results.page = req.body.page
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/generateLink', (req, res) => {
    let link = shortid.generate()
    let buildDoc = {
        _id: link,
        created: new Date(),
        unlisted: true,
        view: 0,
        job: req.body.job,
        builds: req.body.build
    }

    skillBuilds.save(buildDoc, (err) => {
        if (!err) {
            res.send({link: link})
        }
    })
})

router.post('/postBuild', (req, res) => {
    if (req.user) {
        skillBuilds.findOne({_id: req.body.link}, (err, doc) => {
            if (doc) {
                doc.unlisted = false,
                doc.title = req.body.title,
                doc.postedBy = req.user._id

                skillBuilds.save(doc, (err) => {
                    if (!err) {
                        res.send({result: 1})
                    }
                    else {
                        res.send({result: 0})
                    }
                })
            }
        })
    }
})

router.post('/loadBuild', (req, res) => {
    skillBuilds.findAndModify({
        query: {_id: req.body.link, job: req.body.job},
        update: { $inc: {view: 1} }
    }, (err, doc) => {
        if (!err && doc) {
            res.send({builds: doc.builds})
        }
        else {
            res.send({builds: null})
        }
    })
})

router.post('/incrementView', (req, res) => {
    skillBuilds.update(
        {_id: req.body.link, job: req.body.job},
        { $inc: {view: 1} }
    )
    res.send({})
})

router.post('/setMode', (req, res) => {
    req.session.viewMode = req.body.mode
    if (req.user) {
        req.user.mode = req.body.mode
        users.save(req.user)
    }
    res.send(req.session.viewMode)
})

module.exports = router
