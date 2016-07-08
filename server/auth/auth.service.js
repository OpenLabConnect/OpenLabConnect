'use strict';

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var _ = require('lodash');

var config = require('../config/environment');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attach the user object to the request if authenticated
 * Otherwise returns 403
 */
exports.isAuthenticated = function () {
  return compose()
    .use(tokenShouldNotEmpty)
    .use(validateJwt);
};

/**
 * Returns a jwt token, signed by the app secret
 */
exports.signToken = function (user) {

  return jwt.sign(
    { email: user.email },
    config.secrets.session,
    { expiresIn:  '5h' }
  );

};

/**
 * Ensuring token is not empty.
 */
function tokenShouldNotEmpty (req, res, next) {
  var isTokenEmpty = _.chain(req).get('headers.authorization').split(' ').first().isEmpty().value();
  if (isTokenEmpty) {
    res.sendStatus(401);
  } else {
    next();
  }
}
