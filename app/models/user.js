var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

// create schema
var userSchema = new Schema({
  local: {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    hash: String,
    salt: String
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  routes: [{
    name: String,
    coords: [{
      lat: String,
      lng: String
    }]
  }]
});

// generating a password
userSchema.methods.setPassword = function (password) {
  this.local.salt = crypto.randomBytes(16).toString('hex');
  this.local.hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
  return this.local.hash === hash;
};

userSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.local.email,
    first_name: this.local.first_name,
    last_name: this.local.last_name,
    exp: parseInt(expiry.getTime() / 1000),
  }, 'mapperjwtsecret123');
};

//create model to use the schema
var userSchema = mongoose.model('User', userSchema);

// roll out to application
module.exports = userSchema;