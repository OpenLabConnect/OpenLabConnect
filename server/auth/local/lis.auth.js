'use strict';

var authService = require('../auth.service');
var _ = require('lodash');
var needle = require('needle');
var config = require('../../config/environment');
var loginAPILIS = config.loginAPILIS;

/**
 * OpenELIS will return a response after we invoke its login API
 * This function will check value of response (true/false)
 * @param  {Object}   user {usernanem, password}
 * @param  {Function} done
 */
module.exports = function checkAuthenicateFromLIS(user, done) {
  var options = _.merge({
    json: true,
    'Content-Type': 'application/json'
  }, config.net);
  // Using needle to invoke Login API from OpenELIS
  needle.post(loginAPILIS, user, options, function(err, res) {
    if (err) {
      return done(null, false, { msg: 'OPENELIS_ERROR' });
    }
    // Login successfully
    if (res.body.isValid === 'true') {
      // Create temporate user in database. Delete when user logs out.
      var tempUser = {
        email: res.body.username
      };
      console.log('POST ' + loginAPILIS + ' ' + res.statusCode);
      done(null, {
        user: tempUser,
        token: authService.signToken(tempUser)
      });
    } else if (res.body.isValid === 'false') {
      // Login failure
      console.log('POST ' + loginAPILIS + ' ' + res.statusCode);
      // Return User invalid error
      done(null, false, { msg: 'failedUser' });
    } else {
      // Return connect error
      console.log('POST ' + loginAPILIS + ' ' + res.statusCode);
      done(null, false, { msg: 'OPENELIS_ERROR' });
    }
  });
};
