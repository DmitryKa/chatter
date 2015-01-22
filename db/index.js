var mongoose = require('mongoose');

mongoose.connect("mongodb://mongodb:root@ds031671.mongolab.com:31671/chatter");

module.exports = mongoose;