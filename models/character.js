var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var characterSchema = new Schema({
    _id: String,
    updated: { type : Date, default: Date.now},
    data: Schema.Types.Mixed
}, {
    collection: 'Characters'
});

module.exports = mongoose.model('Character', characterSchema);