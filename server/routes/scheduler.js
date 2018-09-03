const cron = require('cron').CronJob
const async = require('async')
const request = require('request')
const cheerio = require('cheerio')

const db = require('../db').db
const rankingInfo = db.collection('rankingInfo')

let scoreQueue = async.queue((data) => {
    let url = `http://${data.region}-bns.ncsoft.com/ingame/bs/character/profile?c=${data.character}`
    request(encodeURI(url), function (error, response, body) {
        if (!error && response.statusCode === 200) {
            body = body.replace('<!-- (s) 비무 정보 ncw only--', '')
            body = body.replace('(e) 비무 정보 -->', '')
            let $ = cheerio.load(body)
            let account = $('.signature dt a').text()
            let characterName = $('.name').first().text()
            characterName = characterName.substring(1, characterName.length-1)

            if (account != null && characterName != '') {
                let solo = parseInt($('.beemoo-info .season-list li').eq(0).find('.rank-point').text())
                let tag = parseInt($('.beemoo-info .season-list li').eq(1).find('.rank-point').text())

                let set = {}
                let unset = {}

                if (data.previousSeasonSolo != solo) {
                    set.solo = solo
                    unset.previousSeasonSolo = 1
                }

                if (data.previousSeasonTag != tag) {
                    set.tag = tag
                    unset.previousSeasonTag = 1
                }

                set.account = account
                set.lastUpdated = new Date()

                rankingInfo.update({_id: data._id}, {$set: set, $unset: unset})
            }
            else {
                rankingInfo.remove({_id: data._id})
            }
        }
    })
}, 30)

let rankQueue = async.queue((data) => {
    async.parallel({
        soloAll: callback => rankingInfo.count({region: data.region, solo: {$gt: data.solo}}, (err, count) => callback(null, count)),
        tagAll: callback => rankingInfo.count({region: data.region, tag: {$gt: data.tag}}, (err, count) => callback(null, count)),
        soloClass: callback => rankingInfo.count({region: data.region, classCode: data.classCode, solo: {$gt: data.solo}}, (err, count) => callback(null, count)),
        tagClass: callback => rankingInfo.count({region: data.region, classCode: data.classCode, tag: {$gt: data.tag}}, (err, count) => callback(null, count)),
    }, (err, results) => {
        data.dailyRankSolo = results.soloAll + 1
        data.dailyRankTag = results.tagAll + 1
        data.dailyClassRankSolo = results.soloClass + 1
        data.dailyClassRankTag = results.tagClass + 1

        rankingInfo.update({_id: data._id}, {$set: data})
    })
}, 40)

const updateScore = new cron({
    cronTime: '0 */10 * * * *',
    onTick: () => {
        console.log('updateScore: updating character scores')
        let time = new Date()
        time.setMinutes(time.getMinutes()-15)
        rankingInfo.find({lastUpdated: {$lt: time}}).sort({lastUpdated: 1}).forEach((err, doc) => {
            if (!err && doc) {
                scoreQueue.push(doc)
            }
        })
    },
    start: true
})

const updateRank = new cron({
    cronTime: '0 0 0 * * *',
    onTick: () => {
        console.log('updateRank: updating character ranks')
        rankingInfo.find({}).forEach((err, doc) => {
            if (!err && doc) {
                rankQueue.push(doc)
            }
        })
    },
    start: true
})
