var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var buildSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    identifier: String,
    type: String,
    title: String,
    author: {type: String, ref: 'User'},
    authorId: String,
    job: String,
    type: String,
    level: String,
    hLevel: String,
    buildCode: String,
    buildList: String,
    content: String,
    datePosted: { type : Date, default: Date.now },
    dateEdited: { type : Date, default: Date.now },
    likes: { type : Number, default: 0 },
    view: { type : Number, default: 0 }
}, {
    collection: 'Builds'
});

buildSchema.index({ title: 'text', content: 'text'});

module.exports = mongoose.model('Build', buildSchema);