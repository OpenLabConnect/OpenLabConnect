'use strict';

var _ = require('lodash');

var SerialAnalyzerModel = require('./serial-analyzer.model');
var TableModel = require('../table/table.model');
var HistoryModel = require('../history/history.model');

/**
 * Error handling for responding
 * @param  res
 * @param  err
 * @returns res.status and err
 */
function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Tracking serial analyzer
 * @param objHistory
 */
function trackAnalyzerSerial (objHistory) {
  TableModel.findOne({ name: 'serial-analyzers' }, function (err, table) {
    // Error handling
    if (err) { console.log(err); }
    objHistory.table = table._id;
    var history = new HistoryModel(objHistory);
    history.save(function (err) {
      if (err) { console.log(err); }
    });
  });
}
/**
 * Creating new serialAnalyzer in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  SerialAnalyzerModel.create(req.body, function (err, serialAnalyzer) {
    if (err) { return handleError(res, err); }
    // Tracking log for serial analyzer.
    var objHistory = {};
    objHistory.analyzer = serialAnalyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Create serial analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(serialAnalyzer);
    objHistory.brief = 'Create new serial analyzer: ' + serialAnalyzer.name;
    trackAnalyzerSerial(objHistory);
    // Return serialAnalyzer object which just have created
    res.status(201).json(_.omit(serialAnalyzer.toObject(), ['__v']));
  });
};

/**
 * Updating serialAnalyzer by ID.
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id }; // Setting serialAnalyzer ID with req.params.id
  SerialAnalyzerModel.findOneAndUpdate(query, req.body, function (err, serialAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!serialAnalyzer) { return res.json(401); }
    // Tracking log for serial analyzer.
    var objHistory = {};
    objHistory.analyzer = serialAnalyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Update serial analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(req.body);
    objHistory.brief = 'Updated serial analyzer: ' + serialAnalyzer.name;
    trackAnalyzerSerial(objHistory);
    // Return updated serialAnalyzer
    res.status(200).json(_.omit(serialAnalyzer.toObject(), ['__v']));
  });
};

/**
 * Finding serialAnalyzer by ID.
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id; // Setting serialAnalyzer ID with req.params.id
  SerialAnalyzerModel.findById(id, function (err, serialAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!serialAnalyzer) { return res.json(401); }
    // Return serialAnalyzer object
    res.status(200).json(_.omit(serialAnalyzer.toObject(), ['__v']));
  });
};

/**
 * Finding all serialAnalyzer.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  SerialAnalyzerModel.find({}, function (err, serialAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!serialAnalyzer) { return res.json(401); }
    res.status(200).json(serialAnalyzer);
  });
};

/**
 * Deleting serialAnalyzer by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id }; // Setting serialAnalyzer ID with req.params.id
  SerialAnalyzerModel.findOneAndRemove(query, function (err, serialAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!serialAnalyzer) { return res.json(401); }
    // Tracking log for serial analyzer.
    var objHistory = {};
    objHistory.analyzer = serialAnalyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Delete serial analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(serialAnalyzer);
    objHistory.brief = 'Deleted serial analyzer: ' + serialAnalyzer.name;
    trackAnalyzerSerial(objHistory);
    // Return deleted serialAnalyzer object
    res.status(200).json(_.omit(serialAnalyzer.toObject(), ['__v']));
  });
};
