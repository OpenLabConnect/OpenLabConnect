'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TestTypeSchema = new Schema({
  name: String
});

/**
 * Virtuals
 */

/**
 * Validations
 */

/**
 * Methods
 */

module.exports = mongoose.model('test-type', TestTypeSchema);
