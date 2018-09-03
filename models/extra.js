var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var extraSchema = new Schema({
    _id: String
}, {
    strict: false,
    collection: 'Extra'
});

module.exports = mongoose.model('Extra', extraSchema)