'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingSchema = new Schema({
  key: String,
  value: String
});

/**
 * Methods
 */
module.exports = mongoose.model('setting', SettingSchema);