'use strict';

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;

var TestSchema = new Schema({
  name: String,
  description: String,
  normalRange: String,
  unit: String,
  section: String,
  testId: String
});
TestSchema.plugin(findOrCreate);
/**
 * Virtuals
 */

/**
 * Validations
 */

/**
 * Methods
 */

module.exports = mongoose.model('test', TestSchema);
