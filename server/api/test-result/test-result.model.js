'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TestResultSchema = new Schema({
  result: String,
  type: { type: Schema.Types.ObjectId, ref: 'test-type' }
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

module.exports = mongoose.model('test-result', TestResultSchema);
