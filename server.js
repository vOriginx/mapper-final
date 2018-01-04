var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var passport = require('passport');
var favicon = require('serve-favicon');
var path = require('path');
var cookieParser = require('cookie-parser');

var app = express();

//Use custom favicon for app
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Config files
var db = require('./config/db');

//Connect to DB
mongoose.connect(db.mongoUri, {
    useMongoClient: true
});

require('./app/models/user');
require('./app/passport');

//Declare port
var port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());

app.use('/app', express.static(__dirname + '/app'));
require('./app/routes')(app, passport);

// Error Handlers
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.json({'message' : err.name + ': ' + err.message});
    }
  });
app.use(function (req, res, next) {
    var err = new Error('Page not found...');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

// Start server and listen
var server = app.listen(port, function () {
    console.log('Server listening on http://' + server.address().address + ':' + server.address().port);
});

// Expose app to the rest of the project      
exports = module.exports = app;