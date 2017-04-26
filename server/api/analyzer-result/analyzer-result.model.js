'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnalyzerResultSchema = new Schema({
  analyzer: { type: Schema.Types.ObjectId, ref: 'analyzer' },
  test: { type: Schema.Types.ObjectId, ref: 'test' },
  result: { type: Schema.Types.ObjectId, ref: 'test-result' },
  testType: String,
  status: String,
  receivedDate: { type: Date, default: Date.now },
  transferDate: Date,
  lastUpdated: Date,
  completedDate: Date,
  accessionNumber: String,
  performedBy: String,
  beginDate: Date // The date when staff start to do tests
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

module.exports = mongoose.model('analyzer-result', AnalyzerResultSchema);
