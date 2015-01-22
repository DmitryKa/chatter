var mongoose = require('mongoose');
var config = require('../config');

var dbUrl = "mongodb://" +
    config.get('db:user') + ":" +
    config.get('db:password') +"@" +
    config.get('db:address') + "/" +
    config.get('db:name')

mongoose.connect(dbUrl);

module.exports = mongoose;