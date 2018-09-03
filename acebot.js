
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    dbConfig = require('./config/db'),
    conn = mongoose.createConnection(dbConfig.url),
    request = require("request"),
    cheerio = require('cheerio'),
    Character = require('./models/character');

var StreamerSchema = new Schema({
        _id: String,
        stream: Schema.Types.Mixed,
        alias: String
    }, {
        collection: 'Streamers'
    });

var StreamerData = conn.model('Streamers', StreamerSchema);


var Twitter = require('twitter');

var twitterClient = new Twitter({
    consumer_key: '6uw9Stm4p6kWfLHCh7dFOkFWT',
    consumer_secret: 'rahplAghESY9saEOcJB0Iil4vCsiaxrJ4t7aTYZ0eTxpm5zrHe',
    access_token_key: '237529913-ImDLKAYuDhwEyNvNXsay4Abmx8WVdnXzscLwRkB3',
    access_token_secret: 'WoXQgRhZKSAJD9KXJQtYqa537YioHih1i4DiUgB6EWF14'
});

var GoogleSpreadsheet = require("google-spreadsheet");
var doc = new GoogleSpreadsheet('1dgI2h4OUxhjWpdqtAFoGhxwWeADyOj7_cwC8vcjOWcg'),
    sheet = null;
doc.useServiceAccountAuth({
    client_email: 'bns-tree@appspot.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCFSGtljnFtcVIX\n/fkxjUZbjJ7SA6lettoDhjdqLfDaTwhOu/K6o/0KBHTmge7i1EeeVWDuAfIM5qU/\nVhi3XE5HyXqVFzimzN842XGQ+H8LaBkMx3Y5bhqbCXUycVpwXN5v6QoaHqImcdgf\nV1xkhE89dEDdsZJ3IN5oIHeTnLdGSx6Hc13xwdjGBlvdcp2tz7J8Cwrv3GQ63PYL\nLapZSJ1MxrlOaKN/pwNhIKEJOMPqaCKu4I3LngmrnhGQRDszHlSXHB56UveM2/xR\nix2UVkob/JrRP1GBVU5qQcdmxfotIwHKrSqdtj5zilUdc7SLc3WN97IXpx+k1+wz\nKZxdbcLPAgMBAAECggEAMXz4U5cWSrq+7qWgt2Nrcma+OeCeLMrcHF7jiItSWNzr\nisCCmgZ12Bhbh5NLLfIAPawZ94XFaEDjrqa7OqoNbt5Co8Uhhd2gLK2gW2HJWmTm\nmDYfkaduPY6/c2FfYUU6Wnc/Bv/E2V2AD/MSHUh7W6gkxaw/Y/hSXHthqu+PpYuD\nbE6oaAs08s2o8244FQj8GJM+MymT5rFpfVNE3yFVzGIk+C1Osst4sJp6GO4rJp45\nLENZB7bJuDWPQ8IjUwVwdDndpM84E8GpTXKbk7ukM9OP9tObJ2ebr/RAFpjiUVul\nBJBzyyjaj0DzFbyg196Hk2cyiEhGm6sVPhI+ux8hAQKBgQD5y92NKj+RfkhA+Br7\nEEcWQUVMhxg/ckBt5+b/Nj+6OOSeoLRuvS6EyfhUrd0AsHOFiGzH32RaX56aC8e0\nw/SSzYopf/BSCMkaCceNqFFhIIqm4lmM/HDyLL6QYoaaSs1seyAQ1sAL6qiTUx40\nk0pcbqOug3O1LO9saq+V5B38QQKBgQCIl8tgkBedFVgaa+e5z1NIHT0OcW/tp5XG\nntFoWZyU6kQDNwhRHwaxFkA8KXKR1gUHFYe6G5xJXbi78s7jKyxUVo8uU9HLViUi\nzMh0L9yuaTdLShIURejkwXq2zsteWHorM4J+FNjOhylleneZt722kb0HI+YqsfZV\nkE3KKEk7DwKBgDhM1ZOCiS9OqhRSlyotAginD2pvLGzoYFMlKHAvFu/u8MA78k7f\nPsPZDapwQVZtbqwTEol99Q1VbdbEfu9kFxSbVN+DoXOr3T+MIrjvzd+5SObSL2LS\nZtZ+dTjvq+zMnT4tBg4liMVmzzXdTvqElAb/PM8Re5vDE/d4mDiNYKDBAoGAXEHy\niwkn+eBVvprNS/IdtSKSf7Pcvq8neZ0BobKNEQPd5jIAexIyqd92iWwRRzE/+hXv\ns6M8f00/HisU09jwOxKv6MGSfP11XbjlV5yQOHk2cLLZ3TmO4RtRcDHiqJmoAo/q\n/o/EFFK0giciqv+wsqRjAXSc3I+Q6x/peraVJ78CgYEAgt5gY/ImmxoHz7zm4ddP\nUDGT7E1UaZqRZyi9NLpOA/QHLam+FJswWOvlgf0sgc2m+F1eEeoJL5x5+6ka9Ual\nH3X3TzDqKTF6Oh1veQu1s0cXUeZT13gqAzYRH0ne5IIRvFYYWAe/iZfv1dOEvnUH\nVHKRuFNKDJ27u40z6nMvwvw=\n-----END PRIVATE KEY-----\n'
}, function() {
    doc.getInfo(function (err, info) {
        sheet = info.worksheets[0];
    });
});

var skillData = require('./models/skillData');
var Discord = require("discord.js");
var bot = new Discord.Client({
    autoReconnect: true
});
bot.loginWithToken("MTc1OTM2NDM3NTA4NjM2Njcy.CgYtEw.mN0yIRVSoBOvLDACw2QaKJFdnc0");

var twitchUrl = "https://api.twitch.tv/kraken/streams/",
    whoUrl = "http://na-bns.ncsoft.com/ingame/bs/character/profile?c=";

bot.on('ready', function() {
    bot.setPlayingGame("with Skynet", function (err) {if (err) console.log(err)});
    
    setInterval(function() {
        StreamerData.find({}).exec(function (err, streamerList) {
            if (err) {console.log(err);}
            
            for (var s in streamerList) {
                request({
                    url: twitchUrl + streamerList[s]._id,
                    json: true
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        if (!this.streamer.stream && body.stream != null) {
                            bot.sendMessage("176969444373954570", "@everyone " + this.streamer.alias + " is now live on twitch! Playing: " + body.stream.game + "\nhttps://www.twitch.tv/" + this.streamer._id);
                        }
                        StreamerData.update({_id: this.streamer.id}, {$set: {stream: body.stream}}, function (err, numAffected) {});
                    }
                }.bind({streamer : streamerList[s]}));
            }
        });
        
    }, 300000);
});

/*
twitterClient.stream('statuses/filter', {follow: 'BladeAndSoulOps'}, function(stream) {
    stream.on('data', function(tweet) {
        bot.sendMessage("176969444373954570", "@everyone BladeAndSoulOps: " + tweet.text);
    });

    stream.on('error', function(error) {
        //throw error;
    });
});
*/

bot.on("message", function(message) {
    var helpRe = /^(!help|!h)/i;
    if (helpRe.test(message.content)) {
            var response = "List of available commands. Case insensitive.\n\n";
            if (message.channel.server.id=="137367520939212800") {
                response += "'!contribute' or !c : Updates google sheet contribution tracker (#clan-contribution only)";
                response += "\nUse: '!c (amount#) (item)'. Example: '!c 10 soulstones'";
                response += "\nMultiple items can be submitted at once by separating them with a comma.\nExample: '!c 10 ss, 5 ms'";
                response += "\n\nAvailable items that can be submitted:";
                response += "\n * Gold: 'gold' or 'g'";
                response += "\n * Soulstone: 'soulstone(s)', 'soul stone(s)' or 'ss'";
                response += "\n * Moonstone: 'moonstone(s)', 'moon stone(s)' or 'ms'";
                response += "\n * Faction Insignia: 'faction insignia', 'insignia' or 'fi'";
                response += "\n * Naryu Silver: 'naryu silver', 'silver' or 'ns'";
                response += "\n * Naryu Gold: 'naryu gold' or 'ng'";
                response += "\n * Fabric: 'fabric' or 'fab'";
                response += "\n * Mirage Crystal: 'mirage crystal', 'crystal' or 'mc'";
                response += "\n * Colorful Powder: 'colorful powder', 'powder' or 'cp'";
                response += "\n * High Quality Fabric: 'high quality fabric', 'hq fabric' or 'hqfab'";
                response += "\n\n--------------\n\n";
            }
            response += "'!roll' : 1-100 RNG (completely fair)";
            response += "\n\n--------------\n\n";
            response += "'!bnstree' : BnSTree skill lookup";
            response += "\nUse: '!bnstree (class code) (exact skill name) (skill tier/form if any)'.\nExample: '!bnstree BM Flicker T4F1'";
            response += "\n\nAvailable class codes:";
            response += "\n * Blade Master: 'BM'";
            response += "\n * Kung Fu Master: 'KF'";
            response += "\n * Destroyer: 'DE'";
            response += "\n * Force Master: 'FM'";
            response += "\n * Assassin: 'AS'";
            response += "\n * Summoner: 'SU'";
            response += "\n * Blade Dancer: 'BD'";
            response += "\n * Warlock: 'WL'";
            response += "\n * Soul Fighter: 'SF'";
            response += "\n\nSkill names with multiple words should be written with dashes between words. Example: 'Flock-of-Blades'";
            response += "\nSkill tier/form is written 'T#F#' or 'Tier# Form#'";
            response += "\n\n--------------\n\n";
            response += "'!who' : Character lookup (NA only)";
            response += "\nUse: '!who (character name)'.\nExample: '!who Silas'";
            response += "\n\n\nFeedback and feature suggestion is welcome~"
            
            bot.reply(message, response);
    }
    else if (message.channel.id == "167722995169755136" && message.channel.server.id=="137367520939212800") {
        var contributeRe = /^(!contribute\s+|!c\s+)(.+)/i; 
        if (contributeRe.test(message.content)) {
            var itemGroups = contributeRe.exec(message.content)[2].trim().toLowerCase().split(",");

            var contributions = {};

            var re = /(\d+)\s*(\w+\s*\w*)/;
            for (var i in itemGroups) {
                var matches = re.exec(itemGroups[i]);
                
                if (matches) {
                    var quantity = matches[1],
                        type = matches[2].replace(/\s+/g, '');

                    var goldRe = /^(gold)(s?)/,
                        soulstoneRe = /^(soulstone)(s?)/,
                        moonstoneRe = /^(moonstone)(s?)/,
                        insigniaRe = /^(faction)?(insignia)(s?)/,
                        naryusilverRe = /^(naryu)?(silver)(s?)/,
                        naryugoldRe = /^(naryugold)(s?)/,
                        fabricRe = /^(fabric)(s?)/,
                        crystalRe = /^(mirage)?(crystal)(s?)/,
                        powderRe = /^(colorful)?(powder)(s?)/,
                        hqfabRe = /^(high quality fabric|hq fabric)(s?)/;

                    if (type == 'g' || goldRe.test(type)) {
                        contributions.g = quantity;
                    }
                    else if (type == 'ss' || soulstoneRe.test(type)) {
                        contributions.ss = quantity;
                    }
                    else if (type == 'ms' || moonstoneRe.test(type)) {
                        contributions.ms = quantity;
                    }
                    else if (type == 'fi' || insigniaRe.test(type)) {
                        contributions.fi = quantity;
                    }
                    else if (type == 'ns' || naryusilverRe.test(type)) {
                        contributions.ns = quantity;
                    }
                    else if (type == 'ng' || naryugoldRe.test(type)) {
                        contributions.ng = quantity;
                    }
                    else if (type == 'fab' || fabricRe.test(type)) {
                        contributions.fab = quantity;
                    }
                    else if (type == 'mc' || crystalRe.test(type)) {
                        contributions.mc = quantity;
                    }
                    else if (type == 'cp' || powderRe.test(type)) {
                        contributions.cp = quantity;
                    }
                    else if (type == 'hqfab' || hqfabRe.test(type)) {
                        contributions.hqfab = quantity;
                    }
                }
            }

            var returnMsg = "";
            for (var c in contributions) {
                switch(c) {
                    case 'g':
                        returnMsg += contributions[c] + " Gold";
                        break;
                    case 'ss':
                        returnMsg += contributions[c] + " Soulstone";
                        if (contributions[c] > 1) {
                            returnMsg += "s";
                        }
                        break;
                    case 'ms':
                        returnMsg += contributions[c] + " Moonstone";
                        if (contributions[c] > 1) {
                            returnMsg += "s";
                        }
                        break;
                    case 'fi':
                        returnMsg += contributions[c] + " Faction Insignia";
                        if (contributions[c] > 1) {
                            returnMsg += "s";
                        }
                        break;
                    case 'ns':
                        returnMsg += contributions[c] + " Naryu Silver";
                        break;
                    case 'ng':
                        returnMsg += contributions[c] + " Naryu Gold";
                        break;
                    case 'fab':
                        returnMsg += contributions[c] + " Fabric";
                        break;
                    case 'mc':
                        returnMsg += contributions[c] + " Mirage Crystal";
                        break;
                    case 'cp':
                        returnMsg += contributions[c] + " Colorful Powder";
                        break;
                    case 'hqfab':
                        returnMsg += contributions[c] + " High Quality Fabric";
                        break;
                }
                returnMsg += ", ";
            }

            returnMsg = returnMsg.slice(0, -2);
            
            if (returnMsg == "") {
                bot.sendMessage("167722995169755136", message.author + " Incorrect item code");
            }
            else {   
                bot.sendMessage("167722995169755136", message.author + " has contributed " + returnMsg + " to the crafting depot.");
                if (sheet) {
                    sheet.getRows(function(err, rows) {
                        var index = -1;
                        for (var r in rows) {
                            if (rows[r].discordid == message.author.id) {
                                index = r;
                                break;
                            }
                        }

                        if (index == -1) {
                            sheet.addRow({
                                name: message.author.username, 
                                discordid: message.author.id,
                                gold: contributions.g,
                                soulstone: contributions.ss,
                                moonstone: contributions.ms,
                                factioninsignia: contributions.fi,
                                naryusilver: contributions.ns,
                                naryugold: contributions.ng,
                                fabric: contributions.fab,
                                miragecrystal: contributions.mc,
                                colorfulpowder: contributions.cp,
                                hqfabric: contributions.hqfab
                            }, function(err) {});
                        }
                        else {
                            rows[index].name = message.author.username;
                            rows[index].gold = formatAdd(rows[index].gold, contributions.g);
                            rows[index].soulstone = formatAdd(rows[index].soulstone, contributions.ss);
                            rows[index].moonstone = formatAdd(rows[index].moonstone, contributions.ms);
                            rows[index].factioninsignia = formatAdd(rows[index].factioninsignia, contributions.fi);
                            rows[index].naryusilver = formatAdd(rows[index].naryusilver, contributions.ns);
                            rows[index].naryugold = formatAdd(rows[index].naryugold, contributions.ng);
                            rows[index].fabric = formatAdd(rows[index].fabric, contributions.fab);
                            rows[index].miragecrystal = formatAdd(rows[index].miragecrystal, contributions.mc);
                            rows[index].colorfulpowder = formatAdd(rows[index].miragecrystal, contributions.cp);
                            rows[index].hqfabric = formatAdd(rows[index].miragecrystal, contributions.hqfab);
                            rows[index].save(function() {});
                        }
                    });
                }
                else {
                    bot.sendMessage("167722995169755136", "Error accessing spreadsheet");
                }
            }
        }
    }
    else {
        var bnstreeRe = /^(!bnstree)\s+(.+)/i,
            rollRe = /^(!roll)\s*(fair)?/i,
            whoRe = /^(!who)(?:NA)?\s+(.+)/i,
            echoRe = /^(!echo)\s+(\d+)\s+(.+)/i;
        if (bnstreeRe.test(message.content)) {
            var skill = bnstreeRe.exec(message.content)[2].trim().toLowerCase();
            
            var skillRe = /^(bm|kf|de|fm|as|su|bd|wl|sf)\s+((?:\w+-?)+)(?:\s+(?:t|tier)\s*([1-5])\s*(?:f|form)\s*([1-4])|(\s*-*))/,
                SkillTooltips = skillData.SkillTooltips;
            
            var matches = skillRe.exec(skill),
                classCode = 0,
                classString = "";
            
            if (matches) {
                switch (matches[1]) {
                    case 'bm': 
                        classString = "Blade Master";
                        classCode = 20;
                        break;
                    case 'kf': 
                        classString = "Kung Fu Master";
                        classCode = 21;
                        break;
                    case 'de': 
                        classString = "Destroyer";
                        classCode = 24;
                        break;
                    case 'fm': 
                        classString = "Force Master";
                        classCode = 22;
                        break;
                    case 'as': 
                        classString = "Assassin";
                        classCode = 25;
                        break;
                    case 'su': 
                        classString = "Summoner";
                        classCode = 26;
                        break;
                    case 'bd': 
                        classString = "Blade Dancer";
                        classCode = 27;
                        break;
                    case 'wl': 
                        classString = "Warlock";
                        classCode = 28;
                        break;
                    case 'sf': 
                        classString = "Soul Fighter";
                        classCode = 30;
                        break;
                }

                var queryObj = { "_id": new RegExp("^" + classCode, "i"), "nodes.0.name": new RegExp("^" + matches[2].replace(/-+/g, " ") + "$", "i"), "fixed": { $exists: false }};            
                SkillTooltips.findOne(queryObj).exec(function (err, tooltipData) {
                    if (err) {console.log(err);}
                    
                    var pos = "0";
                    if (matches[3] != "-" && matches[4]) {
                        pos = matches[3] + matches[4];
                    }
                    
                    var index = tooltipData.nodes.map(function(x) {return x.position; }).indexOf(pos),
                        tooltipNode = tooltipData.nodes[index],
                        response = classString + " BnSTree Skill Lookup\n__**" + tooltipNode.name + "**__";
                    
                    
                    if (tooltipNode.position != "0") {
                        response += " Tier" + matches[3] + " Form" + matches[4];
                    }
                    
                    if (tooltipNode.chi > 0) {
                        response += "\nGenerates " + tooltipNode.chi + " Focus"
                    }
                    else if (tooltipNode.chi < 0) {
                        response += "\nCosts " + Math.abs(tooltipNode.chi) + " Focus"
                    }
                    
                    if (tooltipNode.m1.isArray) {
                        response += "\n";
                        for (var m in tooltipNode.m1) {
                            response += "\n - ";
                            response += parser(tooltipNode.m1[m]);
                        }
                    }
                    else {
                        response += "\n\n - ";
                        response += parser(tooltipNode.m1);
                    }
                    
                    if (tooltipNode.m2) {
                        response += "\n";
                        for (var n in tooltipNode.m2) {
                            response += "\n - ";
                            response += parser(tooltipNode.m2[n]);
                        }
                    }
                    
                    if (tooltipNode.sub) {
                        response += "\n";
                        for (var o in tooltipNode.sub) {
                            response += "\n - ";
                            response += parser(tooltipNode.sub[o]);
                        }
                    }
                    
                    if (!tooltipNode.nosubinfo) {
                        response += "\n\n__Range:__ " + tooltipNode.range + " | __Area:__ " + tooltipNode.area.value + " | __Cast Time:__ " + tooltipNode.cast + " | __Cooldown:__ " + tooltipNode.cooldown;
                        
                        if (tooltipNode.condition) {
                            response += "\n__Conditon:__ ";
                            for (var p in tooltipNode.condition) {
                                if (p == 0) {
                                    response += tooltipNode.condition[p].value;
                                }
                                else {
                                    response += "; " + tooltipNode.condition[p].value;
                                }
                            }
                        }

                        if (tooltipNode.stanceChange) {
                            response += "\n__Change Stance:__ ";
                            for (var q in tooltipNode.stanceChange) {
                                if (q == 0) {
                                    response += tooltipNode.stanceChange[q].value;
                                }
                                else {
                                    response += "; " + tooltipNode.stanceChange[q].value;
                                }
                            }
                        }

                        if (tooltipNode.tags) {
                            response += "\n__Tags:__ ";
                            for (var t in tooltipNode.tags) {
                                if (t == 0) {
                                    response += tooltipNode.tags[t];
                                }
                                else {
                                    response += "; " + tooltipNode.tags[t];
                                }
                            }
                        }
                    }
                    
                    bot.reply(message, "Results from bnstree.com\n\n" + response);
                });
            }
            else {
                bot.reply(message, "Invalid input~");
            }
        }
        else if (rollRe.test(message.content)) {
            var fair = rollRe.exec(message.content)[2];
            if (message.author.id == "175936437508636672") {
                bot.reply(message, "has rolled " + 100);
            }
            else if (message.author.id == "110917704650600448" && !fair) {
                bot.reply(message, "has rolled " + Math.round(90 + Math.random() * 10));
            }
            else {
                bot.reply(message, "has rolled " + Math.round(Math.random() * 100));
            }
        }
        else if (echoRe.test(message.content) && message.author.id == "110917704650600448") {
            var arg = echoRe.exec(message.content);
            bot.sendMessage(arg[2], arg[3]);
        }
        else if (whoRe.test(message.content)) {
            var character = whoRe.exec(message.content)[2].trim().toLowerCase();
            var url = whoUrl + character;
            request(encodeURI(url), function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var $ = cheerio.load(body);
                    
                    var account = $('.signature dt a').html();
                    
                    if (account != null) {
                        var bnstreeUrl = "https://bnstree.com/character?r=na&c=" + character;
                        var region = "na";
                        
                        var signature = $('.signature .desc ul li'),
                            attackHeader = $('.attack .stat-define dt'),
                            attackDesc = $('.attack .stat-define dd'),
                            defenseHeader = $('.defense .stat-define dt'),
                            defenseDesc = $('.defense .stat-define dd');

                        var charInfo = {
                            account: account,
                            region: region,
                            name: $('.name').first().text(),
                            job: signature.eq(0).text(),
                            level: signature.eq(1).text().trim(),
                            server: signature.eq(2).text(),
                            faction: signature.eq(3).text(),
                            clan: signature.eq(4).text(),
                            profile: $('.charaterView img').attr('src'),
                            attack: [],
                            defense: []
                        };

                        for (var a=0; a<attackHeader.length; a++) {
                            charInfo.attack[a] = {};
                            charInfo.attack[a].header = attackHeader.eq(a).find('.title').text();
                            charInfo.attack[a].value = attackHeader.eq(a).find('.stat-point').text();
                            charInfo.attack[a].subValues = [];

                            for (var as=0; as<attackDesc.eq(a).find('.ratio li').length; as++) {
                                charInfo.attack[a].subValues.push(attackDesc.eq(a).find('.ratio li').eq(as).find('.stat-point').text());
                            }
                        }

                        for (var d=0; d<defenseHeader.length; d++) {
                            charInfo.defense[d] = {};
                            charInfo.defense[d].header = defenseHeader.eq(d).find('.title').text();
                            charInfo.defense[d].value = defenseHeader.eq(d).find('.stat-point').text();
                            charInfo.defense[d].subValues = [];

                            for (var ds=0; ds<defenseDesc.eq(d).find('.ratio li').length; ds++) {
                                charInfo.defense[d].subValues.push(defenseDesc.eq(d).find('.ratio li').eq(ds).find('.stat-point').text());
                            }
                        }

                        charInfo.equip = {
                            weapon: {
                                name: $('.wrapWeapon .name span:not(.empty)').text(),
                                grade: $('.wrapWeapon .name span:not(.empty)').attr('class'),
                                icon: $('.wrapWeapon .icon img').attr('src')
                            },
                            necklace: {
                                name: $('.wrapAccessory.necklace .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.necklace .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.necklace .icon img').attr('src')
                            },
                            earring: {
                                name: $('.wrapAccessory.earring .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.earring .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.earring .icon img').attr('src')
                            },
                            bracelet: {
                                name: $('.wrapAccessory.bracelet .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.bracelet .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.bracelet .icon img').attr('src')
                            },
                            ring: {
                                name: $('.wrapAccessory.ring .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.ring .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.ring .icon img').attr('src')
                            },
                            belt: {
                                name: $('.wrapAccessory.belt .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.belt .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.belt .icon img').attr('src')
                            },
                            soul: {
                                name: $('.wrapAccessory.soul .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.soul .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.soul .icon img').attr('src')
                            },
                            outfit: {
                                name: $('.wrapAccessory.clothes .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.clothes .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.clothes .icon img').attr('src')
                            },
                            addon: {
                                name: $('.wrapAccessory.clothesDecoration .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.clothesDecoration .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.clothesDecoration .icon img').attr('src')
                            },
                            face: {
                                name: $('.wrapAccessory.faceDecoration .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.faceDecoration .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.faceDecoration .icon img').attr('src')
                            },
                            hat: {
                                name: $('.wrapAccessory.tire .name span:not(.empty)').text(),
                                grade: $('.wrapAccessory.tire .name span:not(.empty)').attr('class'),
                                icon: $('.wrapAccessory.tire .icon img').attr('src')
                            },
                            soulshield: {
                                icons: {
                                    pos1: $('.gemIcon .pos1 img').attr('src'),
                                    pos2: $('.gemIcon .pos2 img').attr('src'),
                                    pos3: $('.gemIcon .pos3 img').attr('src'),
                                    pos4: $('.gemIcon .pos4 img').attr('src'),
                                    pos5: $('.gemIcon .pos5 img').attr('src'),
                                    pos6: $('.gemIcon .pos6 img').attr('src'),
                                    pos7: $('.gemIcon .pos7 img').attr('src'),
                                    pos8: $('.gemIcon .pos8 img').attr('src')
                                }
                            }
                        };

                        Character.findOneAndUpdate({"data.name": charInfo.name, "data.region": region}, {$set: {data: charInfo}}, {upsert: true, new: true}, function (err, doc) {});

                        var response = "Character lookup";
                        response += "\n\n" + charInfo.account + " **" + charInfo.name + "**";
                        response += "\n" + charInfo.job;
                        response += "\n" + charInfo.level;
                        response += "\n" + charInfo.server;
                        response += "\n" + charInfo.faction;
                        response += "\n" + charInfo.clan;
                        response += "\n\n**Offensive Stats**";
                        response += "\n__Attack Power:__ " + charInfo.attack[0].value;
                        response += "\n__Piercing:__ " + charInfo.attack[2].value + " (" + charInfo.attack[2].subValues[2] + ")";
                        response += "\n__Accuracy:__ " + charInfo.attack[3].value + " (" + charInfo.attack[3].subValues[2] + ")";
                        response += "\n__Critical:__ " + charInfo.attack[5].value + " (" + charInfo.attack[5].subValues[2] + ")";
                        response += "\n__Critical Damage:__ " + charInfo.attack[6].value + " (" + charInfo.attack[6].subValues[2] + ")";
                        response += "\n\n**Equipment**";
                        response += "\n__Weapon:__ " + charInfo.equip.weapon.name;
                        response += "\n__Necklace:__ " + charInfo.equip.necklace.name;
                        response += "\n__Earring:__ " + charInfo.equip.earring.name;
                        response += "\n__Ring:__ " + charInfo.equip.ring.name;
                        response += "\n__Bracelet:__ " + charInfo.equip.bracelet.name;
                        response += "\n__Belt:__ " + charInfo.equip.belt.name;
                        response += "\n__Soul:__ " + charInfo.equip.soul.name;
                        response += "\n\n__Outfit__ " + charInfo.equip.outfit.name;
                        response += "\n__Addon__ " + charInfo.equip.addon.name;
                        response += "\n__Face Adornment:__ " + charInfo.equip.face.name;
                        response += "\n__Head Adornment:__ " + charInfo.equip.hat.name;
                        response += "\n\n Full profile: " + encodeURI(bnstreeUrl);

                        bot.reply(message, response);
                    }
                    else {
                        bot.reply(message, "Character not found.");
                    }
                }
            });
        }
    }
});
bot.on("serverNewMember", function (server, user) {
    if (server.id == "137367520939212800") {
        bot.sendMessage("137367520939212800", "Welcome " + user + " to the Ace Discord server!!\nPlease report here (IGN and maybe a small introduction) so we can give you permission for other channels~\nIn the meantime, please review our rules and guidelines.");
    }
    else if (server.id == "168190149191008256") {
        bot.sendMessage("168190149191008256", "Welcome " + user + " to The Syndicate Discord server!!\nPlease report your IGN and your clan name~");
    }
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parser (obj) {
    var atk = 13,
        c = 1,
        add = 0;
    
    if (obj) {
        var after = obj.after || "";
        if (!obj.type || obj.type == "mod") {
            return obj.value;
        }
        else if (obj.type == "damage") {
            var top = 0,
                bottom = 0,
                scale = "",
                before = obj.before || "Deals ",
                eleimg = null,
                m = 1,
                element = obj.element || "";
                
            if (obj.dualScale) {
                scale = " **[" + obj.dualScale[0] + ", " + obj.dualScale[1] + "]** ";
                bottom = numberWithCommas(Math.round((atk - c) * obj.dualScale[0] * m) + add);
                top = numberWithCommas(Math.round((atk + c) * obj.dualScale[1] * m) + add);
            }
            else {
                scale = " **[" + obj.scale.toFixed(2) + "]** ";
                bottom = numberWithCommas(Math.round(Math.round((atk - c) * obj.scale) * m + add));
                top = numberWithCommas(Math.round(Math.round((Number(atk) + Number(c)) * obj.scale) * m + add));
            }
                
            if (after.trim() != "") {
                after = " " + after;
            }
            if (before != "Deals ") {
                before = before + " deals ";
            }
            if (obj.ex) {
                return before + " *" + bottom + " ~ " + top + "*" + scale + obj.ex + " " + element + " damage" + after;
            }
            else if (obj.increasing) {
                return "Damage dealt increases by *" + bottom + " ~ " + top + "*" + scale + element + " damage" + after;
            }
            else {
                return before + " *" + bottom + " ~ " + top + "*" + scale + element + " damage" + after;
            }
        }
        else if (obj.type == "number") {
            return obj.before + " " + obj.num + " " + after;
        }
        else if (obj.type == "percent") {
            return obj.before + " " + obj.num + "% " + after;
        }
        else if (obj.type == "distance") {
            return obj.before + " " + obj.num + "m " + after;
        }
    }
    else {
        return "";
    }
}

function formatAdd(to, add) {
    if (to.trim() == '') {
        if (isNaN(add)) {
            return '';
        }
        else {
            return add;
        }
    }
    else {
        if (isNaN(add)) {
            return to;
        }
        else {
            return parseInt(add) + parseInt(to);
        }
    }
}

module.exports = bot;