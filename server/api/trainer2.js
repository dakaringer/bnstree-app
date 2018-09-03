const express = require('express')
const async = require('async')
const router = express.Router()
const shortid = require('shortid')

const db = require('../db').db
const classData = db.collection('classData')
const skillList = db.collection('skillList')
const skillRef = db.collection('skillReferences')
const skillTemplates = db.collection('skillTemplates')
const skillTags = db.collection('skillTags')
const skillConstants = db.collection('skillConstants')
const skillPatches = db.collection('skillPatches')
const skillBuilds = db.collection('skillBuilds2')
const skillStats = db.collection('skillStats')

const users = db.collection('users')

const oneDay = 86400000

const prefixes = {
    BM: '20',
    KF: '21',
    FM: '22',
    DE: '24',
    AS: '25',
    SU: '26',
    BD: '27',
    WL: '28',
    SF: '(30|35)',
    SH: '23'
}

router.post('/getTextData', (req, res) => {
    let lang = req.body.lang
    async.parallel({
        ref: callback => skillRef.aggregate([
            {
                $match: {
                    legacy: { $not: { $exists: true } }
                }
            },
            {
                $project: {
                    name: {$ifNull: [`$name.${lang}`, '$name.en']},
                    icon: '$icon'
                }
            }
        ], (err, docs) => callback(null, docs)),
        templates: callback => skillTemplates.aggregate([
            {
                $project: {
                    template: {$ifNull: [`$template.${lang}`, '$template.en']}
                }
            }
        ], (err, docs) => callback(null, docs)),
        tags: callback => skillTags.aggregate([
            {
                $project: {
                    name: {$ifNull: [`$name.${lang}`, '$name.en']},
                    desc: {$ifNull: [`$desc.${lang}`, '$desc.en']}
                }
            }
        ], (err, docs) => callback(null, docs)),
        constants: callback => skillConstants.find({}, {[lang]: 1}, (err, docs) => callback(null, docs)),
        patches: callback => skillPatches.find({}, (err, docs) => callback(null, docs))
    }, (err, results) => {
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/getClassData', (req, res) => {
    let classCode = prefixes[req.body.classCode]
    let mode = req.session.viewMode
    let order = req.session.viewOrder
    if (req.user) {
        if (req.user.mode) {
            mode = req.user.mode
        }
        if (req.user.order) {
            order = req.user.order
        }
    }

    let match = {
        _id: new RegExp(`^${classCode}.*`),
        legacy: { $not: { $exists: true } }
    }

    async.parallel({
        classData: callback => classData.findOne({_id: req.body.classCode}, (err, docs) => callback(null, docs)),
        skillList: callback => skillList.find(match, (err, docs) => callback(null, docs))
    }, (err, results) => {
        results.mode = mode || 'SHOW_LIST'
        results.order = order || 'HOTKEY'
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/postBuild', (req, res) => {
    let link = shortid.generate()
    let buildDoc = {
        _id: link,
        created: new Date(),
        view: 0,
        title: req.body.title,
        postedBy: req.user._id,
        classCode: req.body.classCode,
        type: req.body.type,
        element: req.body.element,
        build: req.body.build
    }

    for (let id in buildDoc.build) {
        let target = `${buildDoc.element}.${buildDoc.type}.${buildDoc.build[id]}`
        let obj = {}
        obj[target] = 1
        skillStats.update({_id: id},{$inc: obj}, {upsert: true})
    }

    skillBuilds.save(buildDoc, (err) => {
        if (!err) {
            res.send({result: 1, link: link})
        }
        else {
            res.send({result: 0})
        }
    })
})

router.post('/loadBuild', (req, res) => {
    skillBuilds.findAndModify({
        query: {_id: req.body.link, job: req.body.job},
        update: { $inc: {view: 1} }
    }, (err, doc) => {
        if (!err && doc) {
            res.send({build: doc})
        }
        else {
            res.send({build: null})
        }
    })
})

router.post('/loadBuildList', (req, res) => {
    const limit = 10

    let match = {}
    if (req.body.classCode) {
        match.classCode = req.body.classCode
    }
    if (req.body.element && req.body.element !== 'all') {
        match.element = req.body.element
    }
    if (req.body.type && req.body.type !== 'all') {
        match.type = req.body.type
    }

    async.parallel({
        list: callback => skillBuilds.find(match, {postedBy: 0}).sort({created: -1}).skip(limit * (req.body.page - 1)).limit(limit, (err, docs) => callback(null, docs)),
        count: callback => skillBuilds.count(match, (err, c) => callback(null, c))
    }, (err, results) => {
        results.page = req.body.page
        results.limit = limit
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/incrementView', (req, res) => {
    skillBuilds.update(
        {_id: req.body.link},
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

router.post('/setOrder', (req, res) => {
    req.session.viewOrder = req.body.order
    if (req.user) {
        req.user.order = req.body.order
        users.save(req.user)
    }
    res.send(req.session.viewOrder)
})

module.exports = router
