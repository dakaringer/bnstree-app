const Clapp = require('clapp')
const Discord = require('discord.js')
const bot = new Discord.Client()

var bnstreeApp = new Clapp.App({
    name: 'BnSTree Bot',
    desc: 'Official BnSTree Discord Bot',
    prefix: '!bnstree',
    version: '1.0',
    onReply: (msg, context) => {
        switch (context.type) {
            case 'reply':
                context.msg.reply(`${msg}`)
                break
            case 'embed':
                if (context.embed) {
                    context.msg.channel.sendMessage('', {embed: context.embed})
                }
                else {
                    context.msg.channel.sendMessage(`${msg}`)
                }
                break
            default:
                context.msg.channel.sendMessage(`${msg}`)
        }
    }
})

var rngApp = new Clapp.App({
    name: 'BnSTree RNG Simulator',
    desc: 'BnSTree RNG Simulator',
    prefix: '!rng',
    version: '1.0',
    onReply: (msg, context) => {
        switch (context.type) {
            case 'reply':
                context.msg.reply(`${msg}`)
                break
            case 'embed':
                context.msg.channel.sendMessage(`${msg}`)
                break
            default:
                context.msg.channel.sendMessage(`${msg}`)
        }
    }
})

const bnstreeCommands = require('./bnstreeBot/commands.js')
bnstreeCommands.forEach(command => {
    bnstreeApp.addCommand(command)
})

const rngCommands = require('./rngBot/commands.js')
rngCommands.forEach(command => {
    rngApp.addCommand(command)
})

bot.login(process.env.BNSTREE_BOT_TOKEN)

bot.on('message', msg => {
    if (bnstreeApp.isCliSentence(msg.content)) {
        bnstreeApp.parseInput(msg.content, {msg: msg})
    }
    else if (rngApp.isCliSentence(msg.content)) {
        rngApp.parseInput(msg.content, {msg: msg})
    }
})

module.exports = bot
