var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function (username, password, done) {
    User.findOne({
      'local.email': username
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      // if no user is found
      if (!user) {
        return done(null, false, {
          message: 'No user found!'
        });
      }
      // if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect credentials!'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));