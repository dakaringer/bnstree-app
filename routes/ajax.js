var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    dbConfig = require('../config/db'),
    Build = require('../models/build'),
    Blog = require('../models/blog'),
    User = require('../models/user'),
    classCodes = ["BM", "KF", "DE", "FM", "AS", "SU", "BD", "WL", "SF"],
    conn = mongoose.createConnection(dbConfig.url2),
    skillData = require('../models/skillData');

var ClassData = skillData.ClassData,
    SkillList = skillData.SkillList,
    SkillTrees = skillData.SkillTrees,
    SkillTooltips = skillData.SkillTooltips,
    KRClassData = skillData.KRClassData,
    KRSkillList = skillData.KRSkillList,
    KRSkillTrees = skillData.KRSkillTrees,
    KRSkillTooltips = skillData.KRSkillTooltips;


var SSListSchema = new Schema({
        _id: String,
        setGroup: String,
        name: String,
        level: Number,
        grade: Number,
        iconBase: String
    }, {
        collection: 'SSList'
    });

var SSTooltipsSchema = new Schema({
        _id: String,
        setEffects: Array,
        pieces: Array
    }, {
        collection: 'SSTooltips'
    });

var SSListData = conn.model('SSList', SSListSchema);
var SSTooltipsData = conn.model('SSTooltips', SSTooltipsSchema);


var ItemListSchema = new Schema({
        _id: String,
        type: String,
        name: String,
        grade: Number
    }, {
        collection: 'ItemList'
    });

var ItemTooltipsSchema = new Schema({
        _id: String,
        bind: String,
        initialSlots: Number,
        maxSlots: Number,
        durabilitySlots: Number,
        acquire: Array,
        stats: Array
    }, {
        collection: 'ItemTooltips'
    });

var ItemListData = conn.model('ItemList', ItemListSchema);
var ItemTooltipsData = conn.model('ItemTooltips', ItemTooltipsSchema);

var EventSchema = new Schema({
        _id: String,
        type: String,
        level: String,
        time: [],
        title: String,
        icon: String,
        desc: String,
        link: String,
        region: String
    }, {
        collection: 'TimerEvents'
    });
var EventData = conn.model('TimerEvents', EventSchema);

router.post('/timer/data', function (req, res, next) {
    EventData.find({ "type": "announcement" }).sort({"time": -1}).exec(function (err, announcement) {
        EventData.find({ "type": "daily" }).sort({"time": -1}).exec(function (err, daily) {
            EventData.find({ "type": "weekly" }).sort({"time": -1}).exec(function (err, weekly) {
                EventData.find({ "type": "community" }).sort({"time": -1}).exec(function (err, event) {
                    var data = [announcement, daily, weekly, event];
                    if (err) {console.log(err);}
                    res.send(data);
                });
            });
        });
    });
});

router.post('/mixer/data', function (req, res, next) {
    SSListData.find({}).sort({"level": -1, "_id": -1}).exec(function (err, listData) {
        if (err) {console.log(err);}
        else if (listData) {
            SSTooltipsData.findOne({"_id": listData[0]._id}).exec(function (err, tooltipData) {
                var data = [listData, tooltipData];
                if (err) {console.log(err);}
                res.send(data);
            });
        }
    });
});

router.post('/mixer/tooltipData', function (req, res, next) {
    SSTooltipsData.find({"_id": {$in: JSON.parse(req.body.id)}}).exec(function (err, tooltipData) {
        if (err) {console.log(err);}
        res.send(tooltipData);
    });
});

router.post('/evolver/data', function (req, res, next) {
    var type = req.body.itemType;
    var find = { $or: [ { "type": type }, { "type": "misc" } ] }
    
    ItemListData.find(find).sort({"_id": 1}).exec(function (err, listData) {
        var tooltipId = null;
        if (listData[0]) {
            if (listData[0].tree) {
                tooltipId = listData[0].tree[0]._id;
            }
            else {
                tooltipId = listData[0]._id;
            }
        }
        
        ItemTooltipsData.findOne({"_id": tooltipId}).exec(function (err, tooltipData) {
            var data = [listData, tooltipData];
            if (err) {console.log(err);}
            res.send(data);
        });
    });
});

router.post('/evolver/tooltipData', function (req, res, next) {
    ItemTooltipsData.findOne({"_id": req.body.id}).exec(function (err, tooltipData) {
        if (err) {console.log(err);}
        res.send(tooltipData);
    });
});

router.post('/:classCode/data', function (req, res, next) {
    var cc = req.params.classCode.toUpperCase();
    ClassData.findOne({_id: cc}).populate('SkillList SkillTrees SkillTooltips').exec(function (err, classData) {
        if (err) {console.log(err);}
        res.send(classData);
    });
});

router.post('/:classCode/dataKR', function (req, res, next) {
    var cc = req.params.classCode.toUpperCase();
    KRClassData.findOne({_id: cc}).populate('SkillList SkillTrees SkillTooltips').exec(function (err, classData) {
        if (err) {console.log(err);}
        res.send(classData);
    });
});

router.post('/mode', function (req, res, next) {
    setTimeout(function () {
        req.session.viewMode = req.body.mode;
        res.send(req.session.viewMode);
    }, 30);
});

router.post('/:classCode/search', function (req, res, next) {
    var cc = req.params.classCode.toUpperCase(),
        page = req.body.pageNumber,
        data = JSON.parse(req.body.form),
        scope = data[0].value,
        text = data[1].value,
        textArray = text.split(" "),
        type = data[2].value,
        re = "^",
        sort = req.body.by;
        
    for (var t in textArray) {
        re += "(?=.*\\b" + textArray[t] + "\\b)";
    }
    re += ".*$";
    
    var reg = new RegExp(re, "i");
    
    var sortQ = {},
        findQ = {};
    
    if (sort == "new") {
        sortQ["datePosted"] = -1;
    }
    else if (sort == "edited") {
        sortQ["dateEdited"] = -1;
    }
    else {
        sortQ["likes"] = -1;
        sortQ["dateEdited"] = -1;
    }
    
    if (type == "content") {
        if (text != '') {
            findQ =  { $text : { $search : text } };
        }
    }
    else {
        findQ[type] = {$regex: reg};
    }
    
    if (scope != "all") {
        findQ["type"] = scope;
    }
    
    findQ["job"] = cc;

    Build.count(findQ, function (err, count) {
        Build.find(findQ).populate('author').sort(sortQ).skip(10 * (page - 1)).limit(10).exec(function (err, builds) {
            res.send([count, builds]);
        });
    });
});

router.post('/profile-search', function (req, res, next) {
    var page = req.body.pageNumber,
        data = JSON.parse(req.body.form),
        job = data[0].value,
        scope = data[1].value,
        text = data[2].value,
        textArray = text.split(" "),
        type = data[3].value,
        re = "^",
        sort = req.body.by,
        cat = req.body.cat;
        
    for (var t in textArray) {
        re += "(?=.*\\b" + textArray[t] + "\\b)";
    }
    re += ".*$";
    
    var reg = new RegExp(re, "i");
    
    var sortQ = {},
        findQ = {};
    
    if (sort == "new") {
        sortQ["datePosted"] = -1;
    }
    else if (sort == "edited") {
        sortQ["dateEdited"] = -1;
    }
    else {
        sortQ["likes"] = -1;
        sortQ["dateEdited"] = -1;
    }
    
    if (type == "content") {
        if (text != '') {
            findQ =  { $text : { $search : text } };
        }
    }
    else {
        findQ[type] = {$regex: reg};
    }
    
    if (scope != "all") {
        findQ["type"] = scope;
    }
    
    if (cat == "my") {
        findQ["authorId"] = req.user._id;
    }
    else {
        findQ["_id"] = { $in: req.user.liked};
    }
    
    if (job != "all") {
        findQ["job"] = job;
    }

    Build.count(findQ, function (err, count) {
        Build.find(findQ).populate('author').sort(sortQ).skip(10 * (page - 1)).limit(10).exec(function (err, builds) {
            res.send([count, builds]);
        });
    });
});

router.post('/blog-search', function (req, res, next) {
    var page = req.body.pageNumber,
        data = JSON.parse(req.body.form),
        text = data[0].value,
        textArray = text.split(" "),
        type = data[1].value,
        re = "^",
        blogType = req.body.type;
        
    for (var t in textArray) {
        re += "(?=.*\\b" + textArray[t] + "\\b)";
    }
    re += ".*$";
    
    var reg = new RegExp(re, "i");
    
    var sortQ = {},
        findQ = {};

    sortQ["datePosted"] = -1;
    
    if (type == "content") {
        if (text != '') {
            findQ =  { $text : { $search : text } };
        }
    }
    else {
        findQ[type] = {$regex: reg};
    }
    
    findQ["type"] = blogType;
    
    Blog.count(findQ, function (err, count) {
        Blog.find(findQ).populate('author').sort(sortQ).skip(10 * (page - 1)).limit(10).exec(function (err, posts) {
            res.send([count, posts]);
        });
    });
});

router.post('/:classCode/:buildId/fav', function (req, res) {
    var cc = req.params.classCode.toUpperCase(),
        buildId = req.params.buildId;
    if (classCodes.indexOf(cc) != -1 && req.user && req.user.liked.indexOf(buildId) == -1) {
        Build.update({_id: buildId, job: cc, authorId: {$ne: req.user._id}}, {$inc: {likes: 1}}, function (err, numAffected) {
            if (err || numAffected.nModified == 0) {
                res.send(false);
            }
            else {
                User.update({_id: req.user._id}, {$push: {liked: buildId}}, function(err, numAffected) {
                    if (err || numAffected.nModified == 0) {
                        res.send(false);
                    }
                    else {
                        req.user.liked.push(buildId);
                        res.send(true);
                    }
                });
            }
        });
    }
    else {
        res.send(false);
    }
});

router.post('/:classCode/:buildId/unfav', function (req, res) {
    var cc = req.params.classCode.toUpperCase(),
        buildId = req.params.buildId;
    if (classCodes.indexOf(cc) != -1 && req.user && req.user.liked.indexOf(buildId) != -1) {
        Build.update({_id: buildId, job: cc, authorId: {$ne: req.user._id}}, {$inc: {likes: -1}}, function (err, numAffected) {
            if (err || numAffected.nModified == 0) {
                res.send(false);
            }
            else {
                User.update({_id: req.user._id}, {$pull: {liked: buildId}}, function(err, numAffected) {
                    if (err || numAffected.nModified == 0) {
                        res.send(false);
                    }
                    else {
                        var index = req.user.liked.indexOf(buildId);
                        req.user.liked.splice(index, 1);
                        res.send(true);
                    }
                });
            }
        });
    }
    else {
        res.send(false);
    }
});

module.exports = router;