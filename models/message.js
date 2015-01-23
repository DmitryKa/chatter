var mongoose = require('../db');
var Schema = mongoose.Schema;
var config = require('../config');

var messageSchema = new Schema({
        name: String,
        text: String,
        date: { type: Date, default: Date.now }
    },
    {
        capped: {
            size: config.get('schema:sizeInBytes'),
            max: config.get('schema:maxDocsNumber')
        }
    });

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;