const express = require('express')
const async = require('async')
const shortid = require('shortid')
const router = express.Router()

const db = require('../db').db
const ssList = db.collection('ssList')
const ssTemplates = db.collection('ssTemplates')
const skillRef = db.collection('skillReferences')
const locations = db.collection('acquireLocations')
const ssBuilds = db.collection('ssBuilds')

const oneDay = 86400000

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
        locations: callback => locations.aggregate([
            {
                $project: {
                    name: {$ifNull: [`$text.${lang}`, '$text.en']},
                    icon: '$icon'
                }
            }
        ], (err, docs) => callback(null, docs)),
        templates: callback => ssTemplates.aggregate([
            {
                $project: {
                    template: {$ifNull: [`$template.${lang}`, '$template.en']}
                }
            }
        ], (err, docs) => callback(null, docs)),

    }, (err, results) => {
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/getList', (req, res) => {
    let lang = req.body.lang
    async.parallel({
        data: callback => ssList.aggregate([
            {
                $lookup: {
                    from: 'ssReferences',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'ref'
                }
            },
            {
                $addFields: {
                    ref: {'$arrayElemAt' : ['$ref', 0]}
                }
            },
            {
                $addFields: {
                    name: {$ifNull: [`$ref.${lang}.name`, '$ref.en.name']},
                    effectName: {$ifNull: [`$ref.${lang}.effectName`, '$ref.en.effectName']},
                    flavor: {$ifNull: [`$ref.${lang}.flavor`, '$ref.en.flavor']}
                }
            },
            {
                $project: {
                    ref: 0
                }
            }
        ], (err, docs) => callback(null, docs)),
    }, (err, results) => {
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/generateLink', (req, res) => {
    let link = shortid.generate()
    let buildDoc = {
        _id: link,
        created: new Date(),
        equipData: req.body.equipData
    }

    ssBuilds.save(buildDoc, (err) => {
        if (!err) {
            res.send({link: link})
        }
    })
})

router.post('/loadBuild', (req, res) => {
    ssBuilds.findOne({_id: req.body.link}, (err, doc) => {
        if (!err && doc) {
            res.send({equipData: doc.equipData})
        }
        else {
            res.send({equipData: null})
        }
    })
})

module.exports = router
