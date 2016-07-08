'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AnalyzerModel = require('../analyzer/analyzer.model');
var SerialAnalyzerSchema = new Schema({
  comPort: String,
  baudRate: String,
  stopBit: Number,
  parity: Number,
  dataBit: Number,
  flowControl: String
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
var SerialAnalyzerModel = AnalyzerModel.discriminator('serial-analyzer', SerialAnalyzerSchema);
module.exports = SerialAnalyzerModel;
