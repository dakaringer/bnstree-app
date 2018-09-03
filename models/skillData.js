var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    dbConfig = require('../config/db'),
    conn = mongoose.createConnection(dbConfig.url2);

var dataSchema = new Schema({
        _id: String,
        version: String,
        SkillList: [{ type: String, ref: 'SkillList'}],
        SkillTrees: [{ type: String, ref: 'SkillTrees'}],
        SkillTooltips: [{ type: String, ref: 'SkillTooltips'}],
        info: Array
    }, {
        collection: 'ClassData'
    });

var listSchema = new Schema({
        _id: String,
    }, {
        collection: 'SkillList'
    });

var treesSchema = new Schema({
        _id: String,
    }, {
        collection: 'SkillTrees'
    });

var tooltipsSchema = new Schema({
        _id: String,
        nodes: Array
    }, {
        collection: 'SkillTooltips'
    });


var testDataSchema = new Schema({
        _id: String,
        version: String,
        SkillList: [{ type: String, ref: 'KRSkillList'}],
        SkillTrees: [{ type: String, ref: 'KRSkillTrees'}],
        SkillTooltips: [{ type: String, ref: 'KRSkillTooltips'}],
        info: Array
    }, {
        collection: 'KRClassData'
    });

var testListSchema = new Schema({
        _id: String,
    }, {
        collection: 'KRSkillList'
    });

var testTreesSchema = new Schema({
        _id: String,
    }, {
        collection: 'KRSkillTrees'
    });

var testTooltipsSchema = new Schema({
        _id: String,
    }, {
        collection: 'KRSkillTooltips'
    });


module.exports = {
    "ClassData": conn.model('ClassData', dataSchema),
    "SkillList": conn.model('SkillList', listSchema),
    "SkillTrees": conn.model('SkillTrees', treesSchema),
    "SkillTooltips": conn.model('SkillTooltips', tooltipsSchema),
    "KRClassData": conn.model('KRClassData', testDataSchema),
    "KRSkillList": conn.model('KRSkillList', testListSchema),
    "KRSkillTrees": conn.model('KRSkillTrees', testTreesSchema),
    "KRSkillTooltips": conn.model('KRSkillTooltips', testTooltipsSchema)
};