const async = require('async')
const request = require('request')
const cheerio = require('cheerio')

function getCharacter(region, name, callback) {
    async.parallel({
        data: callback => {
            let charInfo = null
            let url = `http://${region}-bns.ncsoft.com/ingame/bs/character/profile?c=${name}`
            request(encodeURI(url), function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let $ = cheerio.load(body)

                    let account = $('.signature dt a').html()

                    if (account != null) {
                        let signature = $('.signature .desc ul li'),
                            attackHeader = $('.attack .stat-define dt'),
                            attackDesc = $('.attack .stat-define dd'),
                            defenseHeader = $('.defense .stat-define dt'),
                            defenseDesc = $('.defense .stat-define dd')

                        let characterName = $('.name').first().text()

                        charInfo = {
                            account: account,
                            region: region,
                            name: characterName.substring(1, characterName.length-1),
                            job: signature.eq(0).text(),
                            level: signature.eq(1).text().trim().match(/\d+/g),
                            server: signature.eq(2).text(),
                            faction: signature.eq(3).text(),
                            clan: signature.eq(4).text(),
                            profileImg: $('.charaterView img').attr('src'),
                            attack: [],
                            defense: []
                        }

                        for (let a=0; a<attackHeader.length; a++) {
                            let stat = {}
                            stat.header = attackHeader.eq(a).find('.title').text()
                            stat.value = attackHeader.eq(a).find('.stat-point').text()
                            stat.subValues = []

                            for (let as=0; as<attackDesc.eq(a).find('.ratio li').length; as++) {
                                let valHeader = attackDesc.eq(a).find('.ratio li').eq(as).find('.title').text()
                                let val = attackDesc.eq(a).find('.ratio li').eq(as).find('.stat-point').text()
                                stat.subValues.push([valHeader, val])
                            }

                            charInfo.attack.push(stat)
                        }

                        for (let d=0; d<defenseHeader.length; d++) {
                            let stat = {}
                            stat.header = defenseHeader.eq(d).find('.title').text()
                            stat.value = defenseHeader.eq(d).find('.stat-point').text()
                            stat.subValues = []

                            for (let ds=0; ds<defenseDesc.eq(d).find('.ratio li').length; ds++) {
                                let valHeader = defenseDesc.eq(d).find('.ratio li').eq(ds).find('.title').text()
                                let val = defenseDesc.eq(d).find('.ratio li').eq(ds).find('.stat-point').text()
                                stat.subValues.push([valHeader, val])
                            }

                            charInfo.defense.push(stat)
                        }

                        charInfo.equip = {
                            weapon: {
                                name: $('.wrapWeapon .name span:not(.empty)').text(),
                                grade: $('.wrapWeapon .name span:not(.empty)').attr('class'),
                                icon: $('.wrapWeapon .icon img').attr('src'),
                                gems: []
                            },
                            soulshield: {
                                icons: {
                                    p1: $('.gemIcon .pos1 img').attr('src'),
                                    p2: $('.gemIcon .pos2 img').attr('src'),
                                    p3: $('.gemIcon .pos3 img').attr('src'),
                                    p4: $('.gemIcon .pos4 img').attr('src'),
                                    p5: $('.gemIcon .pos5 img').attr('src'),
                                    p6: $('.gemIcon .pos6 img').attr('src'),
                                    p7: $('.gemIcon .pos7 img').attr('src'),
                                    p8: $('.gemIcon .pos8 img').attr('src')
                                },
                                stats: [],
                                setEffects: []
                            }
                        }

                        let ssStats = $('.lyCharmEffect table tr')
                        for (let s=0; s<ssStats.length; s++) {
                            charInfo.equip.soulshield.stats.push(
                                [ssStats.eq(s).find('th').text(), ssStats.eq(s).find('td').text()]
                            )
                        }

                        let ssSetEffects = $('.lyCharmEffect p')
                        for (let s=0; s<ssSetEffects.length; s++) {
                            charInfo.equip.soulshield.setEffects.push(
                                [
                                    ssSetEffects.eq(s).is('.discription') ? 'description' : 'effect',
                                    ssSetEffects.eq(s).text().trim()
                                ]
                            )
                        }

                        let gems = $('.iconGemSlot img')
                        for (let g=0; g<gems.length; g++) {
                            charInfo.equip.weapon.gems.push(
                                gems.eq(g).attr('src')
                            )
                        }

                        let equips=['necklace', 'earring', 'ring', 'bracelet', 'belt', 'soul', 'guard', 'singongpae', 'bigongpae', 'gloves', 'clothes', 'tire', 'faceDecoration', 'clothesDecoration']
                        equips.forEach(i => {
                            charInfo.equip[i] = {
                                name: $(`.wrapAccessory.${i} .name span:not(.empty)`).text(),
                                grade: $(`.wrapAccessory.${i} .name span:not(.empty)`).attr('class'),
                                icon: $(`.wrapAccessory.${i} .icon img`).attr('src')
                            }
                        })
                    }
                }
                callback(null, charInfo)
            })
        }
    }, (err, result) => {
        callback(null, result.data)
    })
}

const classCodes = {
    'Blade Master': 'bm',
    'Kung Fu Master': 'kf',
    'Destroyer': 'de',
    'Force Master': 'fm',
    'Assassin': 'as',
    'Summoner': 'su',
    'Blade Dancer': 'bd',
    'Warlock': 'wl',
    'Soul Fighter': 'sf'
}

function generateEmbed(region, name, callback) {
    async.parallel({
        data: callback => getCharacter(region, name, callback)
    }, (err, result) => {
        let character = result.data

        let embed = null
        if (character) {
            let fields = [
                {
                    name: 'Attack',
                    value:
                        `**Attack Power:** ${character.attack[0].value}\n` +
                        `**Piercing:** ${character.attack[2].value} (${character.attack[2].subValues[2][1]})\n` +
                        `**Accuracy:** ${character.attack[3].value} (${character.attack[3].subValues[2][1]})\n` +
                        `**Critical Hit:** ${character.attack[5].value} (${character.attack[5].subValues[2][1]})\n` +
                        `**Critical Dmg.:** ${character.attack[6].value} (${character.attack[6].subValues[2][1]})`,
                    inline: true
                },
                {
                    name: 'Defense',
                    value:
                        `**Health:** ${character.defense[0].value}\n` +
                        `**Defense:** ${character.defense[1].value} (${character.defense[1].subValues[2][1]})\n` +
                        `**Evasion:** ${character.defense[3].value} (${character.defense[3].subValues[2][1]})\n` +
                        `**Block:** ${character.defense[4].value} (${character.defense[4].subValues[2][1]})\n` +
                        `**Critical Def.:** ${character.defense[5].value} (${character.defense[5].subValues[0][1]})`,
                    inline: true
                },
                {
                    name: 'Equipment',
                    value:
                        `**Weapon:** ${character.equip.weapon.name}\n` +
                        `**Ring:** ${character.equip.ring.name}\n` +
                        `**Earring:** ${character.equip.earring.name}\n` +
                        `**Necklace:** ${character.equip.necklace.name}\n` +
                        `**Bracelet:** ${character.equip.bracelet.name}\n` +
                        `**Belt:** ${character.equip.belt.name}\n` +
                        `**Gloves:** ${character.equip.gloves.name}\n` +
                        `**Soul:** ${character.equip.soul.name}\n` +
                        `**Pet Aura:** ${character.equip.guard.name}\n` +
                        `**Soul Badge:** ${character.equip.singongpae.name}\n` +
                        `**Mystic Badge:** ${character.equip.bigongpae.name}`
                }
            ]

            embed = {
                author: {
                    name: character.name,
                    url: encodeURI(`https://bnstree.com/character/${character.region}/${character.name}`)
                },
                thumbnail: {
                    url: `https://bnstree.com/images/class/${classCodes[character.job]}.png`
                },
                description: `Level ${character.level[0]}${character.level[1] ? ` • HM Level ${character.level[1]}` : ''}\n${character.job}\n${character.server}\n${character.faction}\n${character.clan}`,
                fields: fields,
                footer: {
                    text: 'BnSTree',
                    icon_url: 'https://bnstree.com/android-chrome-36x36.png'
                }
            }
        }
        else {
            embed = {
                title: 'Character not found.'
            }
        }

        callback(embed)
    })
}

module.exports = generateEmbed

/*
{
    color: 3447003,
    author: {
        name: 'asdf'
    },
    title: 'This is an embed',
    thumbnail: {url:'http://bnstree.com/images/skill/skill_icon_blademaster_0_10.png'},
    description: 'This is a test embed to showcase what they look like and what they can do.',
    fields: [
        {
            name: 'asdf',
            inline: true,
            value: 'They can have different'
        },
        {
            name: 'asdf',
            inline: true,
            value: 'They can have different'
        },
        {
            name: 'asdf',
            inline: true,
            value: 'They can have different'
        },
        {
            name: 'Masked links',
            value: 'You can put [masked links](http://google.com) inside of rich embeds.'
        },
        {
            name: 'Markdown',
            value: '![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1") You can put all the *usual* **__Markdown__** inside of them.'
        },
        {
            name: 'Markdown',
            inline: true,
            value: '![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1") You can put all the *usual* **__Markdown__** inside of them.'
        },
        {
            name: 'Markdown',
            inline: true,
            value: '![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1") You can put all the *usual* **__Markdown__** inside of them.'
        },
        {
            name: 'Markdown',
            inline: true,
            value: '![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1") You can put all the *usual* **__Markdown__** inside of them.'
        },
        {
            name: 'Markdown',
            inline: true,
            value: '![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1") You can put all the *usual* **__Markdown__** inside of them.'
        },
        {
            name: 'Markdown',
            value: '![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1") You can put all the *usual* **__Markdown__** inside of them.'
        }
    ],
    timestamp: new Date(),
    footer: {
        text: '© Example'
    }
}
*/
