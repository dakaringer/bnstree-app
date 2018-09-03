var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    identifier: String,
    title: String,
    author: {type: String, ref: 'User'},
    authorId: String,
    job: String,
    type: String,
    content: String,
    datePosted: { type : Date, default: Date.now },
    dateEdited: { type : Date, default: Date.now },
    likes: { type : Number, default: 0 }
}, {
    collection: 'Blog'
});

blogSchema.index({ title: 'text', content: 'text'});

module.exports = mongoose.model('Blog', blogSchema);