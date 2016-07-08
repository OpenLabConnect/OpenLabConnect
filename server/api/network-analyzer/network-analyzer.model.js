'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AnalyzerModel = require('../analyzer/analyzer.model');
var NetworkAnalyzerSchema = new Schema({
  ip: String,
  port: Number
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
var NetworkAnalyzerModel = AnalyzerModel.discriminator('network-analyzer', NetworkAnalyzerSchema);
module.exports = NetworkAnalyzerModel;
