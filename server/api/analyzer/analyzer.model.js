'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnalyzerSchema = new Schema({
  name: String,
  description: String,
  protocol: String,
  actived: Boolean,
  enabled: Boolean,
  performedBy: String
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

module.exports = mongoose.model('analyzer', AnalyzerSchema);
