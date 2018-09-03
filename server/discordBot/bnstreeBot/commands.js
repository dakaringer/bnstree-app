var Clapp = require('clapp')

const db = require('../../db').db
const skillList = db.collection('skillList')
const skillRef = db.collection('skillReferences')

const generateSkillEmbed = require('./skillHelper')
const generateCharacterEmbed = require('./characterHelper')

const prefixes = {
    BM: '20',
    KF: '21',
    FM: '22',
    DE: '24',
    AS: '25',
    SU: '26',
    BD: '27',
    WL: '28',
    SF: '(30|35)'
}

const skillSearch = new Clapp.Command({
    name: 'skill',
    desc: 'Searches a skill',
    fn: (argv, context) => {
        context.type = 'embed'
        let classCode = prefixes[argv.args.class.toUpperCase()]
        let match = {
            '_id': new RegExp(`^${classCode}.*`),
            'name.en': new RegExp(`^${argv.args.name}$`, 'i')
        }

        return new Promise((fulfill) => {
            skillRef.findOne(match, (err, docs) => {
                if (docs) {
                    let id = docs._id

                    let query = {
                        'types.traits.skillId' : id
                    }
                    if (argv.flags.hm) {
                        query = {
                            'types.hmTraits.skillId' : id
                        }
                    }
                    query.arrayIndex = argv.args.type - 1

                    skillList.aggregate([
                        {
                            $match: {
                                '_id': new RegExp(`^${classCode}.*`)
                            }
                        },
                        {
                            $unwind: {
                                path : '$types'
                            }
                        },
                        {
                            $match: {
                                $or: [
                                    {'types.elementSpec' : argv.args.element},
                                    {'types.elementSpec' : { $exists: false } }
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: '$_id',
                                types : {$push: '$types'}
                            }
                        },
                        {
                            $unwind: {
                                path : '$types',
                                includeArrayIndex : 'arrayIndex'
                            }
                        },
                        {
                            $match: query
                        }
                    ], (err, docs) => {
                        if (!err && docs.length > 0) {
                            let skillData = argv.flags.hm ? docs[0].types.hmTraits : docs[0].types.traits

                            generateSkillEmbed(skillData, argv.args.type, argv.args.element, argv.flags.hm, (embed) => {
                                context.embed = embed
                                fulfill('Done')
                            })
                        }
                        else {
                            fulfill('Error: Type not found')
                        }
                    })
                }
                else {
                    fulfill('Error: Skill name not found')
                }
            })
        })
    },
    args: [
        {
            name: 'class',
            desc: 'Class',
            type: 'string',
            required: true
        },
        {
            name: 'element',
            desc: 'Element Spec',
            type: 'string',
            required: true
        },
        {
            name: 'name',
            desc: 'Skill Name',
            type: 'string',
            required: true
        },
        {
            name: 'type',
            desc: 'Type',
            type: 'number',
            default: 1
        }
    ],
    flags: [
        {
            name: 'hm',
            desc: 'Hongmoon Skill',
            alias: 'h',
            type: 'boolean',
            default: false
        }
    ]
})

const characterSearch = new Clapp.Command({
    name: 'character',
    desc: 'Searches a character',
    fn: (argv, context) => {
        context.type = 'embed'
        return ('Temporarily unavailable')
        /*
        return new Promise((fulfill) => {
            generateCharacterEmbed(argv.args.region, argv.args.name, (embed) => {
                context.embed = embed
                fulfill('Done')
            })
        })*/
    },
    args: [
        {
            name: 'region',
            desc: 'Region',
            type: 'string',
            required: true
        },
        {
            name: 'name',
            desc: 'Character Name',
            type: 'string',
            required: true
        }
    ]
})

module.exports = [
    skillSearch,
    characterSearch
]
