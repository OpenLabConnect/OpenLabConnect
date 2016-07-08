'use strict';

var path = require('path');
var _ = require('lodash');

var all = {

  env: process.env.NODE_ENV || 'production',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  secrets: {
    session: process.env.SESSION_SECRET || 'secretKey'
  },

  net: {
    proxy: process.env.proxy
  }
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
