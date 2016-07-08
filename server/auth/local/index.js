'use strict';

var express = require('express');
var passport = require('passport');

var router = express.Router();

router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, userRes, info) {
    var error = err || info;
    if (error) { return res.status(401).json(error); }
    if (!userRes.user) { return res.status(401).json({ msg: 'login failed' }); }
    res.json({
      user: userRes.user,
      token: userRes.token
    });
  })(req, res, next);
});

module.exports = router;
