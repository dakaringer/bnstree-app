const nodeCache = require('node-cache')
const async = require('async')
const cache = new nodeCache({stdTTL: 86400})

const db = require('../../db').db
const references = db.collection('skillReferences')
const templates = db.collection('skillTemplates')
const constants = db.collection('skillConstants')

const area = [
    'Rectangle',
    'Square',
    'Wide Rectangle',
    'Radius',
    'Arc',
    'Cone'
]

const stats = {
    ap: 13,
    ad: 0,
    c: 1
}

templates.find({}, (err, docs) => {
    let result = {}
    for (let obj of docs) {
        result[obj._id] = obj.template.en
    }
    cache.set('templates', result)
})

function fetchData(id, callback) {
    cache.get(id, (err, obj) => {
        if (err) {
            callback(null, null)
        } else if (obj) {
            callback(null, obj)
        } else {
            if (id == 'templates') {
                templates.find({}, (err, docs) => {
                    if (docs) {
                        let result = {}
                        for (let obj of docs) {
                            result[obj._id] = obj.template.en
                        }
                        cache.set(id, result, () => callback(null, result))
                    }
                })
            }
            else if (id == 'constants') {
                constants.find({}, (err, docs) => {
                    if (docs) {
                        let result = {}
                        for (let obj of docs) {
                            result[obj._id] = obj.en
                            delete obj._id
                        }
                        cache.set(id, result, () => callback(null, result))
                    }
                })
            }
            else {
                references.findOne({_id: id}, (err, doc) => {
                    if (doc) {
                        cache.set(id, doc, () => callback(null, doc))
                    }
                })
            }
        }
    })
}

function generateEmbed(data, type, element, hm, callback) {
    async.parallel({
        skillRef: callback => fetchData(data.skillId, callback),
        templates: callback => fetchData('templates', callback),
        constants: callback => fetchData('constants', callback)
    }, (err, results) => {
        results.constants.defaultElement = element
        results.constants.skillRef = results.skillRef

        let fields = []
        if (data.focus != 0) {
            fields.push({
                name: data.focus > 0
                    ? 'Focus Generation'
                    : 'Focus Cost',
                value: Math.abs(data.focus)
            })
        }

        let attributes = []
        data.attributes.forEach(attb => {
            attributes.push(`- ${stringParser(attb, results.templates, results.constants).trim()}`)
        })

        fields.push({
            name: 'Attributes',
            value: attributes.join('\n')
        }, {
            name: 'Range',
            inline: true,
            value: data.info.range == 0
                ? 'From User'
                : `${data.info.range}m`
        }, {
            name: 'Range',
            inline: true,
            value: data.info.area.type == 0
                ? 'Target'
                : `${data.info.area.value}m ${area[data.info.area.type + 1]}`
        }, {
            name: 'Cast Time',
            inline: true,
            value: data.info.cast == 0
                ? 'Instant'
                : `${data.info.cast}m`
        }, {
            name: 'Cooldown',
            inline: true,
            value: data.info.cooldown == 0
                ? 'Instant'
                : `${data.info.cooldown}m`
        })

        let subAttributes = {
            stanceChange: [],
            condition: [],
            unlock: []
        }
        data.subAttributes.forEach(attb => {
            attb.group = attb.group ? attb.group : 'condition'
            subAttributes[attb.group].push(`${attb.group == 'condition' && !attb.icon ? '- OR' : '-'} ${stringParser(attb, results.templates, results.constants).trim()}`)
        })

        let groupNames = {
            stanceChange: 'Stance Change',
            condition: 'Preconditions',
            unlock: 'Hongmoon Skill'
        }

        for (let g in subAttributes) {
            if (subAttributes[g].length > 0) {
                fields.push({
                    name: groupNames[g],
                    value: subAttributes[g].join('\n')
                })
            }
        }

        let embed = {
            title: results.skillRef.name.en,
            thumbnail: {
                url: `https://bnstree.com/images/skill/${results.skillRef.icon}.png`
            },
            description: `Type ${type} ${hm ? 'HM' : ''}`,
            fields: fields,
            footer: {
                text: 'BnSTree',
                icon_url: 'https://bnstree.com/android-chrome-36x36.png'
            }
        }

        callback(embed)
    })
}

function stringParser(attb, templates, constants, raw=false) {
    let template = templates[attb.template]
    let variables = attb.variables

    let stringArray = template.split(/{|}/)
    let result = []
    let element = null
    for (let str of stringArray) {
        if (str == '') {
            continue
        }

        let identifier = str.charAt(0)
        if (!(['#', '&', '$', '?'].includes(identifier))) {
            result.push(str)
            continue
        }

        let query = str.substring(1).split(/;+|=+/)
        let key = query[0]
        let value = variables[key]
        if (!value && key == 'skill') {
            value = variables.skillName
            key = 'skillName'
        }
        if (!value && key !== 'elementType' && identifier !== '?') {
            continue
        }
        switch(identifier) {
            case '?': {
                //conditional flag
                if (eval(query[1])) {
                    result.push(query[2].trim())
                }
                else if (query[3]) {
                    result.push(query[3].trim())
                }
                break
            }
            case '&': {
                //existential flag
                result.push(query[1])
                break
            }
            case '#': {
                //clause
                let clause = null
                if (typeof value === 'object' && !Array.isArray(value)) {
                    if (value.template) {
                        clause = stringParser(value, templates, constants, true)
                    }
                    else {
                        let obj = {
                            template: query[1],
                            variables: value
                        }
                        clause = stringParser(obj, templates, constants, true)
                    }
                }
                else {
                    let obj = {
                        template: query[1],
                        variables: {}
                    }

                    obj.variables[key] = value

                    clause = stringParser(obj, templates, constants, true)
                }
                result.push(clause)
                break
            }
            case '$': {
                //variable replacement
                switch(key) {
                    case 'damage': {
                        let locale = 'en'
                        let ap = stats.ap
                        let ad = stats.ad
                        let c = stats.c

                        if (value.pet) {
                            ap = 5
                        }

                        element = value.element
                        if (element === 'default') {
                            element = constants.defaultElement
                        }

                        let scale = value.scale ? value.scale : value.dualScale
                        let bottomScale = Array.isArray(scale) ? scale[0] : scale
                        let topScale = Array.isArray(scale) ? scale[1] : scale

                        let bottom = Math.round(Math.round((ap - c) * bottomScale) + ad)
                        let top = Math.round(Math.round((ap + c) * topScale) + ad)

                        bottom = bottom > 0 ? bottom : 0

                        let scaleText = Array.isArray(scale) ? `${bottomScale.toFixed(2)} ~ ${topScale.toFixed(2)}` : scale.toFixed(2)
                        let intl = new Intl.NumberFormat(locale)

                        let obj = {
                            template: value.pet ? 'petScale' : 'scale',
                            variables: {
                                scale: scaleText
                            }
                        }
                        let temp = {
                            scale : '{$scale}x AP',
                            petScale : '{$scale}x Familiar AP'
                        }
                        scaleText = stringParser(obj, temp, constants, null, false)
                        result.push(`${intl.format(bottom)} ~ ${intl.format(top)} [${scaleText}]`)
                        break
                    }
                    case 'elementType' : {
                        element = variables.damage.element
                        if (element === 'default') {
                            element = constants.defaultElement
                        }
                        result.push(constants.ELEMENT[element])
                        break
                    }
                    case 'skill' :
                    case 'skillName' :  {
                        let skillRef = constants.skillRef

                        if (Array.isArray(value)) {
                            let list = []
                            value.forEach((idString) => {
                                list.push(
                                    handleSkill(idString, templates, constants, skillRef)
                                )
                            })
                            result.push(list.join(', '))
                        }
                        else {
                            result.push(handleSkill(value, templates, constants, skillRef))
                        }
                        break
                    }
                    case 'achievement': {
                        let obj = {
                            template: value,
                            variables: {
                                skillName: variables.skill
                            }
                        }

                        obj.variables[key] = value

                        let c = constants[key.toUpperCase()]
                        let clause = stringParser(obj, c ? c : constants)

                        result.push(clause.join(' '))
                        break
                    }
                    case 'condition':
                    case 'stat':
                    case 'status':
                    case 'element':
                    case 'skillType': {
                        let skillRef = constants.skillRef
                        if (Array.isArray(value)) {
                            let list = value.map((s) => (constants[key.toUpperCase()][s] ? constants[key.toUpperCase()][s] : skillRef.name[s]).toLowerCase())
                            result.push(list.join(', '))
                        }
                        else {
                            result.push((constants[key.toUpperCase()][value] ? constants[key.toUpperCase()][value] : skillRef.name[value]).toLowerCase())
                        }
                        break
                    }
                    case 'buff':
                    case 'stance':
                    case 'resource': {
                        if (Array.isArray(value)) {
                            let list = value.map((s) => constants[key.toUpperCase()][s])
                            result.push(list.join(', '))
                        }
                        else {
                            result.push(constants[key.toUpperCase()][value])
                        }
                        break
                    }
                    default: {
                        result.push(value)
                    }
                }
            }
        }
    }

    let r = []
    let f = false
    for (let x of result) {
        if (!f && (typeof x != 'string' || x.trim() != '')) {
            f = true
        }
        if (f) {
            r.push(x)
        }
    }

    if (!raw) {
        r[0] = capitalize(r[0])
    }
    else {
        r.push(' ')
    }

    return r.join(' ').replace(/ +(?= )/g,'')
}

function capitalize(string) {
    if (typeof string === 'string') {
        string = string.replace(/^\s+/,'')
        return `${string.charAt(0).toUpperCase() + string.slice(1)}`
    }
    return string
}

function handleSkill(idString, templates, constants, skillRef) {
    let skillQuery = idString.split(/ +/)
    let id = skillQuery[0]
    let types = skillQuery.slice(1)
    let skillName = skillRef.name[id]

    let affix = null
    if (types.length > 0) {
        let obj = {
            template: 'CLAUSE_TYPES',
            variables: {
                types: types.join(', ')
            }
        }

        affix = ` (${stringParser(obj, templates, constants).join('').trim()})`
    }

    return `${skillName}${affix}`
}

module.exports = generateEmbed
