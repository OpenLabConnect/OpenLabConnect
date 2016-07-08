'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorySchema = new Schema({
  analyzer: { type: Schema.Types.ObjectId, ref: 'analyzer' },
  test: { type: Schema.Types.ObjectId, ref: 'test' },
  user: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
  data: String,
  table: { type: Schema.Types.ObjectId, ref: 'table' },
  brief: String
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

module.exports = mongoose.model('history', HistorySchema);
