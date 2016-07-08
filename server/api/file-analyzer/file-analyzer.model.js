'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AnalyzerModel = require('../analyzer/analyzer.model');
var FileAnalyzerSchema = new Schema({
  fileType: String,
  location: String
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
var FileAnalyzerModel = AnalyzerModel.discriminator('file-analyzer', FileAnalyzerSchema);
module.exports = FileAnalyzerModel;
