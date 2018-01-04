var db = {};

var address = require('./settings');
db.mongoUri = 'mongodb://localhost:27017/mapper';
module.exports = db;