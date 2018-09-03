const express = require('express')
const async = require('async')
const router = express.Router()
const request = require('request')
const cheerio = require('cheerio')

const db = require('../db').db
const rankingInfo = db.collection('rankingInfo')

const oneDay = 86400000

const classCodes = {
    'Blade Master' : 'BM',
    'Kung Fu Master' : 'KF',
    'Destroyer' : 'DE',
    'Force Master' : 'FM',
    'Assassin' : 'AS',
    'Summoner' : 'SU',
    'Blade Dancer' : 'BD',
    'Warlock' : 'WL',
    'Soul Fighter' : 'SF',
    'Shooter' : 'SH'
}

router.post('/getCharacter', (req, res) => {
    let region = req.body.region
    let name = req.body.name
    async.parallel({
        general: callback => {
            let charInfo = null
            let url = `http://${region}-bns.ncsoft.com/ingame/bs/character/profile?c=${name}`
            request(encodeURI(url), function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    body = body.replace('<!-- (s) 비무 정보 ncw only--', '')
                    body = body.replace('(e) 비무 정보 -->', '')
                    let $ = cheerio.load(body)
                    let account = $('.signature dt a').text()
                    let characterName = $('.name').first().text()
                    characterName = characterName.substring(1, characterName.length-1)

                    if (account != null && characterName != '') {
                        let id = `${region}-${characterName}`
                        let signature = $('.signature .desc ul li')

                        let soloRating = parseInt($('.beemoo-info .season-list li').eq(0).find('.rank-point').text())
                        let soloWins = $('.beemoo-info .season-list li').eq(0).find('.win-point').text()
                        let tagRating = parseInt($('.beemoo-info .season-list li').eq(1).find('.rank-point').text())
                        let tagWins = $('.beemoo-info .season-list li').eq(1).find('.win-point').text()
                        let arenaStats = $('.beemoo-info .season-title .total-score').text().trim()

                        rankingInfo.findOne({_id: id}, (err, doc) => {
                            if (doc) {
                                if (doc.previousSeasonSolo == soloRating) {
                                    soloRating = 1300
                                    soloWins = '0'
                                    arenaStats = '-'
                                }
                                if (doc.previousSeasonTag == tagRating) {
                                    tagRating = 1300
                                    tagWins = '0'
                                    arenaStats = '-'
                                }
                            }

                            if (soloRating >= 1600 || tagRating >= 1600) {
                                rankingInfo.update({_id: id},{$set: {
                                    character: characterName,
                                    account: account,
                                    region: region,
                                    classCode: classCodes[signature.eq(0).text()],
                                    solo: soloRating,
                                    tag: tagRating,
                                    lastUpdated: new Date()
                                }}, {upsert: true})
                            }

                            charInfo = {
                                account: account,
                                region: region,
                                name: characterName,
                                className: signature.eq(0).text(),
                                classCode: classCodes[signature.eq(0).text()],
                                level: signature.eq(1).text().trim().match(/\d+/g),
                                server: signature.eq(2).text(),
                                faction: signature.eq(3).text(),
                                clan: signature.eq(4).text(),
                                profileImg: $('.charaterView img').attr('src'),
                                arena: {
                                    stats: arenaStats,
                                    solo: {
                                        rating: soloRating,
                                        wins: soloWins
                                    },
                                    tag: {
                                        rating: tagRating,
                                        wins: tagWins
                                    }
                                }
                            }

                            callback(null, charInfo)
                        })
                    }
                    else {
                        callback(null, charInfo)
                    }
                }
                else {
                    callback(null, charInfo)
                }
            })
        },
        statData: callback => {
            let statInfo = null
            let url = `http://${region}-bns.ncsoft.com/ingame/bs/character/data/abilities.json?c=${name}`
            request(encodeURI(url), function (error, response, body) {
                if (!error && response.statusCode === 200 && response.headers['content-type'].startsWith('application/json')) {
                    statInfo = JSON.parse(body).records
                }
                callback(null, statInfo)
            })
        },
        equipData: callback => {
            let equipInfo = null
            /*
            let url = `http://${region}-bns.ncsoft.com/ingame/bs/character/data/equipments.json?c=${name}`
            request(encodeURI(url), {timeout: 20000}, function (error, response, body) {
                if (!error && response.statusCode === 200 && response.headers['content-type'].startsWith('application/json')) {
                    let equipData = JSON.parse(body)
                    let equipment = equipData.equipments
                    equipInfo = {
                        equipment: {},
                        soulshield: {
                            soulshieldPieces: {},
                            soulshieldStats: equipData.setItemAbility,
                            soulshieldEffects: equipData.setItemProfileMap
                        }
                    }
                    for(let i in equipment) {
                        if (equipment[i].equip.asset_type != 'amulet') {
                            equipInfo.equipment[i] = equipment[i].detail
                        }
                        else if (i !== 'none') {
                            equipInfo.soulshield.soulshieldPieces[i] = equipment[i].detail
                        }
                    }
                }
                callback(null, equipInfo)
            })
            */
            callback(null, null)
        },
        skillData: callback => {
            let skillInfo = null
            let url1 = `http://${region}-bns.ncsoft.com/ingame/api/skill/characters/${name}/skills/pages.json`
            request(encodeURI(url1), function (error, response, body) {
                if (!error && response.statusCode === 200 && response.headers['content-type'].startsWith('application/json')) {
                    let pages = JSON.parse(body).records

                    if (pages) {
                        let pageIndex = pages.current_skill_page
                        let page = pages.skill_page_infos[pageIndex-1]
                        if (page.enable) {
                            let url2 = `http://${region}-bns.ncsoft.com/ingame/api/skill/characters/${name}/skills/pages/${pageIndex}.json`
                            request(encodeURI(url2), function (error, response, body) {
                                if (!error && response.statusCode === 200 && response.headers['content-type'].startsWith('application/json')) {
                                    skillInfo = {
                                        elementIndex: page.attribute,
                                        pageName:  page.name,
                                        skills: JSON.parse(body).records
                                    }
                                }
                                callback(null, skillInfo)
                            })
                        }
                    }
                    else {
                        callback(null, skillInfo)
                    }
                }
            })
        }
    }, (err, results) => {
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

router.post('/getRankings', (req, res) => {
    const limit = 50
    let match = {
        region: req.body.region
    }
    let sort = {}

    if (req.body.class && req.body.class != 'all') {
        match.classCode = req.body.class
    }

    if (req.body.mode == 'solo') {
        match.solo = {$gt: 1600}
        sort.solo = -1
    }
    else {
        match.tag = {$gt: 1600}
        sort.tag = -1
    }

    async.parallel({
        list: callback => rankingInfo.find(match).sort(sort).skip(limit * (req.body.page - 1)).limit(limit, (err, docs) => {
            if (req.body.page > 1 && docs[0]) {
                if (req.body.mode == 'solo') {
                    match.solo = {$gt: docs[0].solo}
                }
                else {
                    match.tag = {$gt: docs[0].tag}
                }
                rankingInfo.count(match, (err, count) => {
                    docs[0].initialRank = count + 1,
                    callback(null, docs)
                })
            }
            else {
                callback(null, docs)
            }
        }),
        count: callback => rankingInfo.count(match, (err, c) => callback(null, c))
    }, (err, results) => {
        results.page = req.body.page
        results.limit = limit
        res.setHeader('Cache-Control', `max-age=${oneDay}`)
        res.send(results)
    })
})

module.exports = router
