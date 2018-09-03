var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: String,
    username: String,
    startName: String,
    liked: [String],
    lastLogin: { type : Date, default: Date.now},
    admin: Boolean
}, {
    collection: 'Users'
});

module.exports = mongoose.model('User', userSchema);