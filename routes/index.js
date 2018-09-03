var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    dbConfig = require('../config/db'),
    Blog = require('../models/blog'),
    Build = require('../models/build'),
    User = require('../models/user'),
    Character = require('../models/character'),
    Extra = require('../models/extra'),
    React = require('react'),
    ReactDOM = require('react-dom/server'),
    components = require('../gulp/js/react/compiled/trainer3'),
    components2 = require('../gulp/js/react/compiled/mixer'),
    components3 = require('../gulp/js/react/compiled/evolver'),
    components4 = require('../gulp/js/react/compiled/timer'),
    factory = React.createFactory(components.Trainer),
    factory2 = React.createFactory(components2.Mixer),
    factory3 = React.createFactory(components3.Evolver),
    factory4 = React.createFactory(components4.Timer),
    classCodes = ["BM", "KF", "DE", "FM", "AS", "SU", "BD", "WL", "SF"],
    conn = mongoose.createConnection(dbConfig.url2),
    request = require("request"),
    cheerio = require('cheerio'),
    async = require('async'),
    schedule = require('node-schedule'),
    dataSchema = new Schema({
        _id: String,
        info: {}
    }, {
        collection: 'ClassData'
    });
    ClassData = conn.model('ClassData', dataSchema);


function searchChar(name, region, cb) {
    var charInfo = -1;
    var url = "http://"+region+"-bns.ncsoft.com/ingame/bs/character/profile?c="+name;
    request(encodeURI(url), function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var $ = cheerio.load(body);

            var account = $('.signature dt a').html()

            if (account != null) {
                var signature = $('.signature .desc ul li'),
                    attackHeader = $('.attack .stat-define dt'),
                    attackDesc = $('.attack .stat-define dd'),
                    defenseHeader = $('.defense .stat-define dt'),
                    defenseDesc = $('.defense .stat-define dd');

                charInfo = {
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
                        var val = attackDesc.eq(a).find('.ratio li').eq(as).find('.stat-point').text();
                        charInfo.attack[a].subValues.push(val);
                    }
                }

                for (var d=0; d<defenseHeader.length; d++) {
                    charInfo.defense[d] = {};
                    charInfo.defense[d].header = defenseHeader.eq(d).find('.title').text();
                    charInfo.defense[d].value = defenseHeader.eq(d).find('.stat-point').text();
                    charInfo.defense[d].subValues = [];

                    for (var ds=0; ds<defenseDesc.eq(d).find('.ratio li').length; ds++) {
                        var val = defenseDesc.eq(d).find('.ratio li').eq(ds).find('.stat-point').text();
                        charInfo.defense[d].subValues.push(val);
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
            }
        }

        cb(charInfo);
    });
}

/* GET home page. */
router.get('/', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;
    var loggedin = false;
    if (req.user) {
        loggedin = req.user.username;
    }
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    Build.find({}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, newBuilds) {
        Build.find({ "datePosted": { $gt: oneWeekAgo } }).populate('author').sort({"likes": -1}).limit(10).exec(function (err, popBuilds) {
            Blog.find({type: 'update'}).populate('author').sort({"datePosted": -1}).limit(5).exec(function (err, update) {
                Blog.find({type: 'blog'}).populate('author').sort({"datePosted": -1}).limit(5).exec(function (err, blog) {
                    res.render('index', {
                        page: 'main',
                        update: update,
                        blog: blog,
                        loggedin: loggedin,
                        newBuildList: newBuilds,
                        popBuildList: popBuilds,
                        react: ReactDOM.renderToString(factory4())
                    });
                });
            });
        });
    });
});



router.get('/blog', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;

    var loggedin = false,
        admin = false;
    Blog.find({type: 'blog'}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, posts) {
        Blog.count({type: 'blog'}, function (err, count) {
            Blog.findOne({type: 'blog'}).populate('author').sort({"datePosted": -1}).exec(function (err, latest) {
                if (req.user) {
                    loggedin = req.user.username;
                    admin = req.user.admin;
                }

                res.render('blog', {
                    page: 'blog',
                    loggedin: loggedin,
                    latestPost: latest,
                    posts: posts,
                    count: count,
                    type: 'blog',
                    admin: admin
                });
            });
        });
    });
});

router.get('/blog/pub', function (req, res, next) {
    if (req.user && req.user.admin) {
        res.render('blogPublish', {
            page: 'blog',
            loggedin: req.user.username,
            type: "blog",
            pub: true
        });
    }
    else {
        res.redirect('/');
    }
});

router.post('/blog/pub', function (req, res) {
    if (req.user && req.user.admin) {
        var post = new Blog();
        post.author = req.user._id;
        post.authorId = req.user._id;
        post.title = req.body.title == "" ? "noname" : req.body.title.trim();
        post.content = req.body.content.trim();
        post.type = "blog",
        post.save(function (err) {});
        res.redirect('/blog/' + post._id);
    }
    else {
        res.redirect('/');
    }
});


router.get('/blog/:blogId', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;

    var blogId = req.params.blogId;

    var loggedin = false,
        admin = false;
    Blog.find({type: 'blog'}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, posts) {
        Blog.count({type: 'blog'}, function (err, count) {
            Blog.findOne({_id: blogId}).populate('author').sort({"datePosted": -1}).exec(function (err, mainPost) {
                if (req.user) {
                    loggedin = req.user.username;
                    admin = req.user.admin;
                }

                res.render('blogPost', {
                    page: 'blog',
                    loggedin: loggedin,
                    mainPost: mainPost,
                    posts: posts,
                    count: count,
                    type: 'blog',
                    identifier: blogId,
                    blog: true,
                    admin: admin
                });
            });
        });
    });
});

router.get('/blog/:blogId/edit', function (req, res, next) {
    var blogId = req.params.blogId;
    var loggedin = false;
    if (req.user) {
        loggedin = req.user.username;
    }
    Blog.findOne({_id: blogId}).populate('author').exec(function (err, post) {
        if (req.user && post && req.user.admin) {
            res.render('blogEdit', {
                page: 'blog',
                pub: true,
                type: 'blog',
                loggedin: loggedin,
                postData: post
            });
        }
        else {
            res.redirect('/');
        }
    });
});

router.post('/blog/:blogId/edit', function (req, res, next) {
    var blogId = req.params.blogId;

    if (req.user && req.user.admin) {
        Blog.update({_id: blogId},
                    {$set: {title: req.body.title.trim(),
                     content: req.body.content.trim(),
                     dateEdited: new Date().toISOString()}},
                    function (err, numAffected) {
            res.redirect('/blog/' + blogId);
        });
    }
    else {
        res.redirect('/');
    }
});

router.delete('/blog/:blogId/delete', function (req, res, next) {
    var blogId = req.params.blogId;

    if (req.user && req.user.admin) {
        Blog.remove({_id: blogId}, function(err) {
            res.redirect('/blog');
        });
    }
    else {
        res.redirect('/');
    }
});

router.get('/update', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;

    var loggedin = false,
        admin = false;
    Blog.find({type: 'update'}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, posts) {
        Blog.count({type: 'update'}, function (err, count) {
            Blog.findOne({type: 'update'}).populate('author').sort({"datePosted": -1}).exec(function (err, latest) {
                if (req.user) {
                    loggedin = req.user.username;
                    admin = req.user.admin;
                }

                res.render('blog', {
                    page: 'blog',
                    loggedin: loggedin,
                    latestPost: latest,
                    posts: posts,
                    count: count,
                    type: 'update',
                    admin: admin
                });
            });
        });
    });
});

router.get('/update/pub', function (req, res, next) {
    if (req.user && req.user.admin) {
        res.render('blogPublish', {
            page: 'blog',
            loggedin: req.user.username,
            type: "update",
            pub: true
        });
    }
    else {
        res.redirect('/');
    }
});

router.post('/update/pub', function (req, res) {
    if (req.user && req.user.admin) {
        var post = new Blog();
        post.author = req.user._id;
        post.authorId = req.user._id;
        post.title = req.body.title == "" ? "noname" : req.body.title.trim();
        post.content = req.body.content.trim();
        post.type = "update",
        post.save(function (err) {});
        res.redirect('/update/' + post._id);
    }
    else {
        res.redirect('/');
    }
});

router.get('/update/:blogId', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;

    var blogId = req.params.blogId;

    var loggedin = false,
        admin = false;
    Blog.find({type: 'update'}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, posts) {
        Blog.count({type: 'update'}, function (err, count) {
            Blog.findOne({_id: blogId}).populate('author').sort({"datePosted": -1}).exec(function (err, mainPost) {
                if (req.user) {
                    loggedin = req.user.username;
                    admin = req.user.admin;
                }

                res.render('blogPost', {
                    page: 'blog',
                    loggedin: loggedin,
                    mainPost: mainPost,
                    posts: posts,
                    count: count,
                    type: 'update',
                    identifier: blogId,
                    blog: true,
                    admin: admin
                });
            });
        });
    });
});


router.get('/update/:blogId/edit', function (req, res, next) {
    var blogId = req.params.blogId;
    var loggedin = false;
    if (req.user) {
        loggedin = req.user.username;
    }
    Blog.findOne({_id: blogId}).populate('author').exec(function (err, post) {
        if (req.user && post && req.user.admin) {
            res.render('blogEdit', {
                page: 'blog',
                pub: true,
                type: 'update',
                loggedin: loggedin,
                postData: post
            });
        }
        else {
            res.redirect('/');
        }
    });
});

router.post('/update/:blogId/edit', function (req, res, next) {
    var blogId = req.params.blogId;

    if (req.user && req.user.admin) {
        Blog.update({_id: blogId},
                    {$set: {title: req.body.title.trim(),
                     content: req.body.content.trim(),
                     dateEdited: new Date().toISOString()}},
                    function (err, numAffected) {
            res.redirect('/update/' + blogId);
        });
    }
    else {
        res.redirect('/');
    }
});

router.delete('/update/:blogId/delete', function (req, res, next) {
    var blogId = req.params.blogId;

    if (req.user && req.user.admin) {
        Blog.remove({_id: blogId}, function(err) {
            res.redirect('/update');
        });
    }
    else {
        res.redirect('/');
    }
});

router.get('/profile', function (req, res, next) {
    if (req.user) {
        req.session.redirectUrl = req.originalUrl;
        Build.find({authorId: req.user._id}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, myBuilds) {
            Build.count({authorId: req.user._id}, function (err, myCount) {
                Build.find({_id: { $in: req.user.liked}}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, likedBuilds) {
                    Build.count({_id: { $in: req.user.liked}}, function (err, likedCount) {
                        res.render('profile', {
                            page: 'profile',
                            loggedin: req.user.username,
                            myBuildList: myBuilds,
                            likedBuildList: likedBuilds,
                            myBuildCount: myCount,
                            likedBuildCount: likedCount
                        });
                    });
                });
            });
        });
    }
    else {
        res.redirect('/');
    }
});


router.post('/profile', function (req, res, next) {
    if (req.user) {
        var username = JSON.parse(req.body.form)[0].value.trim();
        if (username != '') {
            User.count({username: username}, function(err, n) {
                if (n == 0) {
                    User.update({_id: req.user._id},
                                {$set: {username: username}},
                                function (err, numAffected) {
                        if (numAffected.n == 1) {
                            res.send("0");
                        }
                        else {
                            res.send("2");
                        }
                    });
                }
                else {
                    res.send("1");
                }
            });
        }
        else {
            res.send("2");
        }
    }
    else {
        res.redirect('/');
    }
});


router.get('/soulshield', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;
    var query = req.query;

    var loggedin = false;
    if (req.user) {
        loggedin = req.user.username;
    }
    res.render('soulshield', {
        page: 'mixer',
        loggedin: loggedin,
        buildCode: query.c,
        react: ReactDOM.renderToString(factory2())
    });
});

/*
router.get('/evolver', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;

    var loggedin = false;
    if (req.user) {
        loggedin = req.user.username;
    }
    res.render('item', {
        page: 'evolver',
        loggedin: loggedin,
        react: ReactDOM.renderToString(factory3())
    });
});
*/

router.get('/test', function (req, res, next) {
    var query = req.query;

    if (req.user && req.user.admin) {
    }
    var alphabet = "abcdefghijklmnopqrstuvwxyz".split('');

    for (var a in alphabet) {
        for (var b in alphabet) {
            var c = alphabet[a] + alphabet[b];
            q1.push({region: "na", c: c, p: 291}, crawl);
            q1.push({region: "eu", c: c, p: 291}, crawl);
        }
    }
});

var skillData = require('../models/skillData');
var SkillList = skillData.SkillList;

router.get('/test2', function (req, res, next) {
    SkillList.find({}).exec(function (err, list) {
        var index = [];
        var result = [];

        for (var l in list) {
            var obj = list[l];
            var id = obj.get('id');
            var name = obj.get('name');
            var img = obj.get('icon');
            if (index.indexOf(img) == -1) {
                index.push(img);
                result.push({
                    id: id,
                    name: name,
                    icon: img
                });
            }

            var obj2 = obj.get('change');
            var subIndex = 0;
            if (obj2) {
                for (var m in obj2) {
                    var subIcon = obj2[m].icon;
                    var subName = obj2[m].name;
                    if (index.indexOf(subIcon) == -1) {
                        index.push(subIcon);
                        result.push({
                            id: id + '-' + subIndex,
                            name: subName,
                            icon: subIcon
                        });
                        subIndex++;
                    }
                }
            }

            var obj3 = obj.get('subEntry');
            if (obj3) {
                for (var n in obj3) {
                    var subId = obj3[n].id;
                    var subIcon = obj3[n].icon;
                    var subName = obj3[n].name;
                    if (index.indexOf(subIcon) == -1) {
                        index.push(subIcon);
                        result.push({
                            id: subId,
                            name: subName,
                            icon: subIcon
                        });
                    }
                }
            }

            var a = new Extra({
                _id: 'newList',
                data: result
            })


        }
        a.save(function(err){console.log(err)})
    });
});


router.get('/test3', function (req, res, next) {
    SkillList.find({}).exec(function (err, list) {
        var result = [];

        for (var l in list) {
            var obj = list[l];
            var key = obj.get('hotkey');
            var minlv = obj.get('minLevel');
            var id = obj.get('id');
            result.push({
                _id: id,
                hotkey: key,
                minLevel: minlv
            });

            var a = new Extra({
                _id: 'newListx',
                data: result
            })
        }

        a.save(function(err){console.log(err)})
    });
});

var q1 = async.queue(function(task, callback) {
    console.log(task);
    var url = "http://"+task.region+"-bns.ncsoft.com/ingame/bs/character/search/info?c="+task.c+"&p="+task.p;
    request(url, function(err, res, body) {
        if (err) return console.log(err);
        if (res.statusCode != 200) return console.log(res.statusCode);

        var $ = cheerio.load(body);

        var next = {
            region: task.region,
            c: task.c,
            p: task.p + 1
        }

        if ($('.user').html()) {
            var characters = [];
            for (var i = 0; i < 5; i++) {
                if ($('.user > li').eq(i).find('.desc li').eq(1).text() == "Level 50") {
                    q2.push({name: $('.user dt a').eq(i).text(), region: task.region});
                }
            }
        }
        else {
            next = null
        }
        callback(next);
    });
}, 4);

var q2 = async.queue(function(task, callback) {
    console.log(task);
    searchChar(task.name, task.region, function(charInfo) {
        if (charInfo && charInfo != -1) {
            Character.findOneAndUpdate({"data.name": charInfo.name, "data.region": charInfo.region}, {$set: {data: charInfo, updated: new Date()}}, {upsert: true, new: true}, function (err, doc) {if (err) {console.log(err)}});
        }
    });
    callback();
}, 1);

function crawl (next) {
    if (next) {
        q1.push(next, crawl);
    }
}


router.get('/character', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;

    var loggedin = false;
    if (req.user) {
        loggedin = req.user.username;
    }

    var character = req.query.c,
        region = req.query.r;

    if (character) {
        searchChar(character, region, function(charInfo) {
            if (charInfo && charInfo != -1) {
                Character.findOneAndUpdate({"data.name": charInfo.name, "data.region": region}, {$set: {data: charInfo, updated: new Date()}}, {upsert: true, new: true}, function (err, doc) {if (err) {console.log(err)}});
            }

            res.render('character', {
                page: 'character',
                loggedin: loggedin,
                charInfo: charInfo,
                region: region
            });
        });
    }
    else {
        Extra.findOne({_id: "Stats"}).exec(function (err, stats) {
            var regionData = stats.get('regionData'),
                data = stats.get('data');

            var chartData = {
                na: chartify(regionData.na.serverGroups, "group"),
                eu: chartify(regionData.eu.serverGroups, "group"),
                job: chartify(data.classes, "job"),
                level: chartify(data.levels, "hm")
            };

            res.render('character', {
                page: 'character',
                loggedin: loggedin,
                charInfo: null,
                regionData: regionData,
                data: data,
                chartData: chartData
            });
        });
    }
});

function chartify (arr, label) {
    var result = {label: [], data: []};

    for (var a in arr) {
        result.label.push(arr[a][label]);
        result.data.push(arr[a].count);
    }

    return result;
}


router.get('/w/:classCode', function (req, res, next) {
    var cc = req.params.classCode.toUpperCase(),
        query = req.query,
        readonly = false;

    if (query.readonly == "true") {
        readonly = true;
    }

    if (classCodes.indexOf(cc) != -1) {
        Build.find({job: cc}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, builds) {
            Build.count({job: cc}, function (err, count) {
                ClassData.findOne({_id: cc}, {"info": 1}).exec(function (err, classInfo) {
                    res.render('widget', {
                        page: 'skill',
                        job: cc,
                        buildList: builds,
                        buildCode: query.build,
                        count: count,
                        classInfo: classInfo,
                        readonly: readonly,
                        mode: 0,
                        react: ReactDOM.renderToString(factory())
                    });
                });
            });
        });
    }
});

router.get('/:classCode', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;
    var cc = req.params.classCode.toUpperCase(),
        query = req.query;

    if (classCodes.indexOf(cc) != -1) {
        var loggedin = false;
        Build.find({job: cc}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, builds) {
            Build.count({job: cc}, function (err, count) {
                ClassData.findOne({_id: cc}, {"info": 1}).exec(function (err, classInfo) {
                    if (req.user) {
                        loggedin = req.user.username;
                    }
                    res.render('tree', {
                        page: 'skill',
                        job: cc,
                        loggedin: loggedin,
                        buildList: builds,
                        buildCode: query.build,
                        count: count,
                        classInfo: classInfo,
                        identifier: '',
                        mode: req.session.viewMode || 0,
                        react: ReactDOM.renderToString(factory())
                    });
                });
            });
        });
    }
    else {
        res.redirect('/');
    }
});

router.get('/:classCode/pub', function (req, res, next) {
    var cc = req.params.classCode.toUpperCase(),
        query = req.query;
    if (classCodes.indexOf(cc) != -1) {
        if (req.user && !req.user.banned) {
            ClassData.findOne({_id: cc}, {"info": 1}).exec(function (err, classInfo) {
                var bl = [
                    {
                        "name": "Build1",
                        "code": query.build
                    },
                    null,null,null,null
                ];

                res.render('publish', {
                    page: 'skill',
                    title: 'Publish Build',
                    job: cc,
                    pub: true,
                    loggedin: req.user.username,
                    buildCode: query.build,
                    buildList: JSON.stringify(bl),
                    classInfo: classInfo,
                    mode: req.session.viewMode || 0,
                    react: ReactDOM.renderToString(factory())
                });
            });
        }
        else {
            res.redirect('/');
        }
    }
    else {
        res.redirect('/');
    }
});

router.post('/:classCode/pub', function (req, res) {
    var cc = req.params.classCode.toUpperCase();

    var code = req.body.buildCode,
        lv = code.substring(0,2),
        hLv = code.substring(2,4);

    var typeV = false;
    if (req.body.type == "PvP" || req.body.type == "PvE") {
        typeV = true;
    }
    var numV = true;
    if (Number(lv) == NaN || Number(hLv) == NaN || lv < 1 || lv > 50 || hLv < 0 || hLv > 20) {
        numV = false;
    }
    if (classCodes.indexOf(cc) != -1 && req.user && typeV && numV && !req.user.banned) {
        var build = new Build();
        build.type = req.body.type;
        build.author = req.user._id;
        build.authorId = req.user._id;
        build.title = req.body.title == "" ? "noname" : req.body.title.trim();
        build.job = cc;
        build.level = lv.trim();
        build.hLevel = hLv.trim();
        build.buildCode = req.body.buildCode.trim();
        build.buildList = req.body.buildList.trim();
        build.content = req.body.content.trim();
        build.save(function (err) {});
        res.redirect('/' + cc + '/' + build._id);
    }
    else {
        res.redirect('/');
    }
});

router.get('/:classCode/:buildId', function (req, res, next) {
    req.session.redirectUrl = req.originalUrl;
    var cc = req.params.classCode.toUpperCase(),
        buildId = req.params.buildId;
    if (classCodes.indexOf(cc) != -1) {
        var loggedin = false;
        var fav = null;
        ClassData.findOne({_id: cc}, {"info": 1}).exec(function (err, classInfo) {
            Build.find({job: cc}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, builds) {
                Build.count({job: cc}, function (err, count) {
                    Build.findOne({_id: buildId}).populate('author').exec(function (err, build) {
                        if (build) {
                            var editable = req.user && req.user._id == build.authorId;
                            if (req.user) {
                                loggedin = req.user.username;

                                if (!editable) {
                                    if (req.user.liked.indexOf(buildId) == -1) {
                                        fav = false;
                                    }
                                    else {
                                        fav = true;
                                    }
                                }
                                if (req.user._id != build.authorId) {
                                    Build.update({_id: buildId, job: cc}, {$inc: {views: 1}}, function (err, numAffected) {
                                        if (numAffected.nModified == 0) {
                                            Build.update({_id: buildId, job: cc}, {$set: {views: 0}}, function (err, numAffected) {});
                                        }
                                    });
                                }
                            }
                            res.render('post', {
                                page: 'skill',
                                language: 'eng',
                                job: cc,
                                loggedin: loggedin,
                                buildList: builds,
                                buildData: build,
                                editable: editable,
                                fav: fav,
                                count: count,
                                classInfo: classInfo,
                                identifier: buildId,
                                mode: req.session.viewMode || 0,
                                react: ReactDOM.renderToString(factory())
                            });
                        }
                        else {
                            res.redirect('/');
                        }
                    });
                });
            });
        });
    }
    else {
        res.redirect('/');
    }
});

router.get('/w/:classCode/:buildId', function (req, res, next) {
    var cc = req.params.classCode.toUpperCase(),
        buildId = req.params.buildId;
    if (classCodes.indexOf(cc) != -1) {
        ClassData.findOne({_id: cc}, {"info": 1}).exec(function (err, classInfo) {
            Build.find({job: cc}).populate('author').sort({"datePosted": -1}).limit(10).exec(function (err, builds) {
                Build.count({job: cc}, function (err, count) {
                    Build.findOne({_id: buildId}).populate('author').exec(function (err, build) {
                        if (build) {
                            res.render('widget', {
                                page: 'skill',
                                language: 'eng',
                                job: cc,
                                buildList: builds,
                                buildCode: build.buildCode,
                                count: count,
                                classInfo: classInfo,
                                readonly: true,
                                mode: 0,
                                react: ReactDOM.renderToString(factory())
                            });
                        }
                    });
                });
            });
        });
    }
});

router.get('/:classCode/:buildId/edit', function (req, res, next) {
    var cc = req.params.classCode.toUpperCase(),
        buildId = req.params.buildId;
    if (classCodes.indexOf(cc) != -1) {
        var loggedin = false;
        if (req.user) {
            loggedin = req.user.username;
        }
        ClassData.findOne({_id: cc}, {"info": 1}).exec(function (err, classInfo) {
            Build.findOne({_id: buildId}).populate('author').exec(function (err, build) {
                if (req.user && build && req.user._id == build.authorId && cc == build.job) {
                    res.render('edit', {
                        page: 'skill',
                        language: 'eng',
                        job: cc,
                        pub: true,
                        loggedin: loggedin,
                        buildData: build,
                        classInfo: classInfo,
                        mode: req.session.viewMode || 0,
                        react: ReactDOM.renderToString(factory())
                    });
                }
                else {
                    res.redirect('/');
                }
            });
        });
    }
    else {
        res.redirect('/');
    }
});

router.post('/:classCode/:buildId/edit', function (req, res, next) {
    var cc = req.params.classCode.toUpperCase(),
        buildId = req.params.buildId;

    var lv = req.body.buildCode.substring(0,2),
        hLv = req.body.buildCode.substring(2,4);

    var typeV = false;
    if (req.body.type == "PvP" || req.body.type == "PvE") {
        typeV = true;
    }
    var numV = true;
    if (Number(lv) == NaN || Number(hLv) == NaN || lv < 1 || lv > 50 || hLv < 0 || hLv > 20) {
        numV = false;
    }

    if (classCodes.indexOf(cc) != -1 && req.user && typeV && numV) {
        Build.update({_id: buildId, job: cc, authorId: req.user._id},
                    {$set: {type: req.body.type,
                     title: req.body.title.trim(),
                     level: lv.trim(),
                     hLevel: hLv.trim(),
                     buildCode: req.body.buildCode.trim(),
                     buildList: req.body.buildList.trim(),
                     content: req.body.content.trim(),
                     dateEdited: new Date().toISOString()}},
                    function (err, numAffected) {
            res.redirect('/' + cc + '/' + buildId);
        });
    }
    else {
        res.redirect('/');
    }
});

router.delete('/:classCode/:buildId/delete', function (req, res, next) {
    var cc = req.params.classCode.toUpperCase(),
        buildId = req.params.buildId;
    if (classCodes.indexOf(cc) != -1 && req.user) {
        Build.remove({_id: buildId, job: cc, authorId: req.user._id}, function(err) {
            res.redirect('/' + cc);
        });
    }
    else {
        res.redirect('/');
    }
});

module.exports = router;
