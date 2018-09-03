var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    dbConfig = require('./config/db'),
    Character = require('./models/character'),
    Extra = require('./models/extra'),
    async = require('async'),
    schedule = require('node-schedule');

function compareChar(x, y) {
    var attb = ["weapon", "necklace", "earring", "ring", "bracelet", "belt", "soul", "outfit", "addon", "face", "hat"];
    
    for (var a in attb) {
        if (x[attb[a]] && y[attb[a]] && x[attb[a]].name != y[attb[a]].name) {
            return false;
        }
    }
    return true;
}

function groupCount (match, criteria, sort, cb) {
    Character.aggregate([
        {$match: match},
        {
            $group: {
                _id: criteria,
                count: {$sum: 1},
            }
        },
        {$sort: sort}
    ],
    function (err, results) {
        cb(null, results);
    });
}

function itemCount (criteria, cb) {
    Character.aggregate([
        {$match: { "data.level": /.*Level 50.*/i }},
        {
            $group: {
                _id: '$' + criteria,
                count: {$sum: 1},
            }
        },
        {$sort: {"count": -1 }},
        {$match: { "_id":  { $ne: "" }}}
    ],
    function (err, results) {
        var re = /(?:(.+) (\w+ - Stage \d+)|(.+) (\w+))/;
        var arr = [];
        
        if (criteria == 'data.equip.soul.name') {
            re = /(.+)/;
        }
        
        for (var r in results) {
            var test = re.exec(results[r]._id);
            
            if (test) {
                var str = test[1];
                if(!str) {
                    str = test[3];
                }
                var index = arr.map(function(x) {return x._id; }).indexOf(str);
                if (index == -1) {
                    arr.push({
                        _id: str,
                        count: results[r].count
                    });
                }
                else {
                    arr[index].count += results[r].count;
                }
            }
        }
        
        cb(null, arr.sort(function (a,b) {return b.count - a.count}).slice(0, 5));
    });
}

function getAverage (criteria, cb) {
    var mapF = null;
    switch (criteria) {
        case 'ap':
            mapF = function () {emit(null, {val: [parseFloat(this.data.attack[0].value),0,0,0]})};
            break;
        case 'chr':
            mapF = function () {emit(null, {val: [parseFloat(this.data.attack[5].subValues[2]),0,0,0]})};
            break;
        case 'chd':
            mapF = function () {emit(null, {val: [parseFloat(this.data.attack[6].subValues[2]),0,0,0]})};
            break;
    }
        
    var o = {
        query: { "data.level": /.*Level 50.*/i },
        map: mapF, //this.data.attack[0].value
        reduce: function (k, values) { 
            var len = values.length;
            if (len > 0) {
                var sum = 0,
                    sum2 = 0,
                    average = 0,
                    sd = 0,
                    min = 0,
                    max = 0;

                for (var v in values) {
                    sum += values[v].val[0];

                    if (values[v].val[0] > max) {
                        max = values[v].val[0];
                    }
                }

                average = sum/len;
                min = max;

                for (var v in values) {
                    sum2 += Math.pow(values[v].val[0] - average, 2);

                    if (values[v].val[0] < min) {
                        min = values[v].val[0];
                    }
                }

                sd = Math.sqrt(sum2/len);

                return {val: [average, sd, min, max]}
            }
        }
    };

    Character.mapReduce(o, function (err, results) {
        cb(null, results[0].value.val);
    });
}


var i = schedule.scheduleJob('0 0 * * * *', function(){
    async.parallel({
        serverDist: groupCount.bind(null, { "data.level": /.*Level 50.*/i }, {region: '$data.region', server: "$data.server"}, {"_id.server": 1}),
        ceruDist: groupCount.bind(null, { "data.level": /.*Level 50.*/i, "data.faction": /.*Cerulean.*/i }, {region: '$data.region', server: "$data.server"}, {"_id.server": 1}),
        crimDist: groupCount.bind(null, { "data.level": /.*Level 50.*/i, "data.faction": /.*Crimson.*/i }, {region: '$data.region', server: "$data.server"}, {"_id.server": 1}),
        jobDist: groupCount.bind(null, { "data.level": /.*Level 50.*/i }, '$data.job', {count: -1}),
        lvlDist: groupCount.bind(null, { "data.level": /.*Level 50.*/i }, '$data.level', {_id: 1}),
        averageAP: getAverage.bind(null, 'ap'),
        averageCHR: getAverage.bind(null, 'chr'),
        averageCHD: getAverage.bind(null, 'chd'),
        equipWeapon: itemCount.bind(null, 'data.equip.weapon.name'),
        equipNecklace: itemCount.bind(null, 'data.equip.necklace.name'),
        equipEarring: itemCount.bind(null, 'data.equip.earring.name'),
        equipRing: itemCount.bind(null, 'data.equip.ring.name'),
        equipBracelet: itemCount.bind(null, 'data.equip.bracelet.name'),
        equipBelt: itemCount.bind(null, 'data.equip.belt.name'),
        equipSoul: itemCount.bind(null, 'data.equip.soul.name'),
    },
    function(err, results) {                
        var regionData = {
            na: {
                count: 0,
                serverGroups: [
                    {
                        group : "Group 1",
                        serverList : ["Master Hong", "Gunma", "Taywong"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 2",
                        serverList : ["Mushin", "Old Man Cho"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 3",
                        serverList : ["Jiwan", "Soha", "Dochun"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 4",
                        serverList : ["Poharan", "Iksanun"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 5",
                        serverList : ["Yehara", "Hajoon", "Onmyung"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 6",
                        serverList : ["Juwol", "Yunwa", "Junghado"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    }
                ]
            },
            eu: {
                count: 0,
                serverGroups: [
                    {
                        group : "Group 1",
                        serverList : ["Windrest", "Wild Springs", "Highland Gate"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 2",
                        serverList : ["Cardinal Gates", "Hao District", "Greenhollow", "Spirit's Rest"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 3",
                        serverList : ["Starfall Crater", "Ebon Hall", "Angler's Watch", "Twin Wagons"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 4",
                        serverList : ["[DE] Frostgipfel", "[DE] Bambusdorf"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 5",
                        serverList : ["[DE] Windweide", "[DE] Himmelsfarm"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    },
                    {
                        group : "Group 6",
                        serverList : ["[FR] Dokumo", "[FR] Ogong", "[FR] Hogdonny"],
                        count : 0,
                        faction: {
                            ceru: 0,
                            crim: 0
                        }
                    }
                ]
            }
        };

        for (var r in results.serverDist) {
            var region = results.serverDist[r]._id.region;
            regionData[region].count += results.serverDist[r].count;
            for (var g in regionData[region].serverGroups) {
                if (regionData[region].serverGroups[g].serverList.indexOf(results.serverDist[r]._id.server) != -1) {
                    regionData[region].serverGroups[g].count += results.serverDist[r].count;
                    regionData[region].serverGroups[g].faction.ceru += results.ceruDist[r].count;
                    regionData[region].serverGroups[g].faction.crim += results.crimDist[r].count;
                    break;
                }
            }
        }
        
        var data = {
            classes: [],
            levels: [],
            stats: {
                attack: {
                    average: results.averageAP[0],
                    sd: results.averageAP[1],
                    min: results.averageAP[2],
                    max: results.averageAP[3]
                },
                critRate: {
                    average: results.averageCHR[0],
                    sd: results.averageCHR[1],
                    min: results.averageCHR[2],
                    max: results.averageCHR[3]
                },
                critDamage: {
                    average: results.averageCHD[0],
                    sd: results.averageCHD[1],
                    min: results.averageCHD[2],
                    max: results.averageCHD[3]
                }
            },
            equips: {
                weapon: results.equipWeapon,
                necklace: results.equipNecklace,
                earring: results.equipEarring,
                ring: results.equipRing,
                bracelet: results.equipBracelet,
                belt: results.equipBelt,
                soul: results.equipSoul,
            }
        };

        for (var c in results.jobDist) {
            data.classes.push({
                job : results.jobDist[c]._id,
                count : results.jobDist[c].count
            });
        }

        var re = /Level 50 .+ (\d+)/;
        for (var l in results.lvlDist) {
            var test = re.exec(results.lvlDist[l]._id);

            if (test) {
                var index = data.levels.map(function(x) {return x.hm; }).indexOf(test[1]);
                if (index == -1) {
                    data.levels.push({
                        hm : test[1],
                        count : results.lvlDist[l].count
                    });
                }
                else {
                    data.levels[index].count += results.lvlDist[l].count
                }
            }
        }
        data.levels.sort(function (a,b) {return a.hm - b.hm})

        Extra.update({ _id: "Stats" }, { $set: { regionData: regionData, data: data }}, function(err) {if (err) {console.log(err)} else {console.log("Average calculated")}});
    });
});

/*
var j = schedule.scheduleJob('0 0 0 * * *', function(){
    var d = new Date();
    console.log(d.toString() + ': Updating character data');
    Character.find({}).exec(function (err, ch) {
        for (var c in ch) {
            if (ch[c].data.name) {
                var name = ch[c].data.name.substring(1, ch[c].data.name.length-1),
                    region = ch[c].data.region;

                searchChar(name, region, function(pre, charInfo) {
                    if (charInfo && charInfo != -1 && !compareChar(pre.equip, charInfo.equip)) {
                        Character.findOneAndUpdate({"data.name": charInfo.name, "data.region": charInfo.region}, {$set: {data: charInfo, updated: new Date()}}, {upsert: true, new: true}, function (err, doc) {if (err) {console.log(err)}});
                    }

                }.bind(null, ch[c].data));
            }
        }
    });
});

var k = schedule.scheduleJob('0 0 0 1 *2 *', function(){  //Add a slash between *2 later
    var d = new Date();
    console.log(d.toString() + ': Mining character data');
    crawlSearch("na", "an", 1);
    crawlSearch("eu", "ae", 2672);
});
*/