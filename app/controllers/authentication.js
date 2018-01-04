var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function (req, res) {
  var user = new User();

  user.local.first_name = req.body.first_name;
  user.local.last_name = req.body.last_name;
  user.local.email = req.body.email;

  user.setPassword(req.body.password);

  user.save(function (err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      'token': token
    });
  });
};

module.exports.login = function (req, res) {
  passport.authenticate('local', function (err, user, info) {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(500).json(err);
      return;
    }

    // User found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        'token': token,
        user: user
      });
    } else {
      // User not found
      res.status(500).json(info);
    }
  })(req, req);
};