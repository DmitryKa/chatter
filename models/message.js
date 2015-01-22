var mongoose = require('../db');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    name: String,
    message: String,
    date: { type: Date, default: Date.now() }
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;