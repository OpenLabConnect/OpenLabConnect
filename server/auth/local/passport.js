'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var authLIS = require('./lis.auth');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
function (email, password, done) {
  var user = {
    "username": email,
    "password": password
  };
  authLIS(user, done);
}));

