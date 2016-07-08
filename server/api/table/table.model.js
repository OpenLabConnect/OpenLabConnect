'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TableSchema = new Schema({
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

module.exports = mongoose.model('table', TableSchema);
