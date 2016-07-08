'use strict';

var _ = require('lodash');

var authService = require('../../auth/auth.service');
var User = require('./user.model');

function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  User.create(req.body, function (err, user) {
    if (err) {
      return handleError(res, err); }
    res.status(201).json({
      user: _.omit(user.toObject(), ['passwordHash', 'salt']),
      token: authService.signToken(user._id)
    });
  });
};

/**
 * Return the current logged user.
 *
 * @param req
 * @param res
 */
exports.getMe = function (req, res) {
  //  User is kept in session (req.user).
  res.status(200).json(req.user);
};
