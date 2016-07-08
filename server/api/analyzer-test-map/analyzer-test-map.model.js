'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AnalyzerTestMapSchema = new Schema({
  analyzer: { type: Schema.Types.ObjectId, ref: 'analyzer' },
  testCode: String,
  test: { type: Schema.Types.ObjectId, ref: 'test' }
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

module.exports = mongoose.model('analyzer-test-map', AnalyzerTestMapSchema);
