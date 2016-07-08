'use strict';

var _ = require('lodash');

var TestResultModel = require('./test-result.model');
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
 * Tracking test-result
 * @param objHistory
 */
function trackTestResult (objHistory) {
  TableModel.findOne({ name: 'test-results' }, function (err, table) {
    // Error handling
    if (err) { console.log(err); }
    objHistory.table = table._id;
    var history = new HistoryModel(objHistory);
    // Save history object
    history.save(function (err) {
      if (err) { console.log(err); }
    });
  });
}

/**
 * Creating new testResult in DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  TestResultModel.create(req.body, function (err, testResult) {
    if (err) { return handleError(res, err); }
    // Tracking log for testResult.
    var objHistory = {};
    objHistory.user = req.user.email;
    objHistory.action = 'Create test result';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(testResult);
    objHistory.brief = 'Create new result'
                      + '\nID: ' + testResult._id
                      + '\nResult: ' + testResult.result;
    trackTestResult(objHistory);
    // Return testResult object which just have created
    res.status(201).json(_.omit(testResult.toObject(), ['__v']));
  });
};

/**
 * Updating testResult by ID.
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id }; // Setting testResult ID with req.params.id
  TestResultModel.findOneAndUpdate(query, req.body, function (err, testResult) {
    if (err) { return handleError(res, err); }
    if (!testResult) { return res.json(401); }
    // Tracking log for testResult.
    var objHistory = {};
    objHistory.user = req.user.email;
    objHistory.action = 'Update test result';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(testResult);
    objHistory.brief = 'Updated result'
                      + '\nID: ' + testResult._id
                      + '\nChange result from: ' + testResult.result + ' to ' + req.body.result;
    trackTestResult(objHistory);
    // Return updated testResult object
    res.status(200).json(_.omit(testResult.toObject(), ['__v']));
  });
};

/**
 * Finding testResult by ID.
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id; // Setting testResult ID with req.params.id
  TestResultModel.findById(id)
  .populate('type')
  .exec(function (err, testResult) {
    if (err) { return handleError(res, err); }
    if (!testResult) { return res.json(401); }
    // Return testResult object
    res.status(200).json(_.omit(testResult, ['__v']));
  });
};

/**
 * Finding all testResult.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  TestResultModel.find({})
  .populate('type')
  .exec(function (err, testResult) {
    if (err) { return handleError(res, err); }
    if (!testResult) { return res.json(401); }
    res.status(200).json(testResult);
  });
};

/**
 * Deleting testResult by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id }; // Setting testResult ID with req.params.id
  TestResultModel.findOneAndRemove(query, function (err, testResult) {
    if (err) { return handleError(res, err); }
    if (!testResult) { return res.json(401); }
    // Tracking log for testResult.
    var objHistory = {};
    objHistory.user = req.user.email;
    objHistory.action = 'Delete test result';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(testResult);
    objHistory.brief = 'Deleted result'
                      + '\nID: ' + testResult._id
                      + '\nResult: ' + testResult.result;
    trackTestResult(objHistory);
    // Return deleted testResult object
    res.status(200).json(_.omit(testResult.toObject(), ['__v']));
  });
};
