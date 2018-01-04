var express = require('express');
var router = express.Router();
var path = require('path');
var jwt = require('express-jwt');
var ctrlProfile = require('./controllers/profile');
var ctrlAuth = require('./controllers/authentication');
var ctrlJourneys = require('./controllers/journeys');

var auth = jwt({
  secret: 'mapperjwtsecret123',
  userProperty: 'payload'
});

module.exports = function (app, passport) {
  // Send all requests to index.html, let angular handle it from there
  app.get('/', function (req, res) {
    res.sendFile(__dirname, '/public/index.html');
  });

  // Authentication
  app.post('/api/register', ctrlAuth.register);
  app.post('/api/login', ctrlAuth.login);

  app.get('/api/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // Journeys
  app.post('/api/journeys', ctrlJourneys.saveJourney);
  app.get('/api/journeys', auth, ctrlJourneys.getJourneys);
  // app.get('/api/journeyDetails', auth, ctrlJourneys.getJourneyDetails);
  app.delete('/api/journeys', auth, ctrlJourneys.deleteJourney);

};

  

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}