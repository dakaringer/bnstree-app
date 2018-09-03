var Clapp = require('clapp')

const db = require('../../db').db
//const skillList = db.collection('skillList')

const roll = new Clapp.Command({
    name: 'roll',
    desc: 'Rolls a random number',
    fn: (argv, context) => {
        context.type = 'reply'
        let roll = Math.round(Math.random() * argv.args.limit)
        return (`has rolled ${roll}`)
    },
    args: [
        {
            name: 'limit',
            desc: 'Upper limit for a roll',
            type: 'number',
            required: false,
            default: 100
        }
    ]
})

const simulateSuccess = new Clapp.Command({
    name: 'simulate',
    desc: 'Simulates success chance',
    fn: (argv, context) => {
        context.type = 'reply'
        let success = 0
        for (let i = 0; i < argv.args.trial; i++) {
            let roll = Math.round(Math.random() * 100)
            if (argv.args.success >= roll) {
                success++
            }
        }
        return (`Succeeded ${success}/${argv.args.trial} times`)
    },
    args: [
        {
            name: 'success',
            desc: '% of success',
            type: 'number',
            required: true
        },
        {
            name: 'trial',
            desc: 'Number of trials',
            type: 'number',
            required: false,
            default: 1
        }
    ]
})

module.exports = [
    roll,
    simulateSuccess
]
