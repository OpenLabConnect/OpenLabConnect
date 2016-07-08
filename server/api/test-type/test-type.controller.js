'use strict';

var _ = require('lodash');

var TestTypeModel = require('./test-type.model');
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
  TableModel.findOne({ name: 'test-types' }, function (err, table) {
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
  TestTypeModel.create(req.body, function (err, TestType) {
    if (err) { return handleError(res, err); }
    // Tracking log for testResult.
    var objHistory = {};
    objHistory.user = req.user.email;
    objHistory.action = 'Create test type';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(TestType);
    objHistory.brief = 'Create new test type'
                      + '\nID: ' + TestType._id
                      + '\nName: ' + TestType.name;
    trackTestResult(objHistory);
    // Return TestType object which just have created
    res.status(201).json(_.omit(TestType.toObject(), ['__v']));
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
  TestTypeModel.findOneAndUpdate(query, req.body, function (err, TestType) {
    if (err) { return handleError(res, err); }
    if (!TestType) { return res.json(401); }
    // Tracking log for testResult.
    var objHistory = {};
    objHistory.user = req.user.email;
    objHistory.action = 'Update test type';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(req.body);
    objHistory.brief = 'Updated test type'
                      + '\nID: ' + TestType._id
                      + '\nChange name from: ' + TestType.name + ' to ' + req.body.name;
    trackTestResult(objHistory);
    // Return updated TestType object
    res.status(200).json(_.omit(TestType.toObject(), ['__v']));
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
  TestTypeModel.findById(id, function (err, TestType) {
    if (err) { return handleError(res, err); }
    if (!TestType) { return res.json(401); }
    // Return testResult object
    res.status(200).json(_.omit(TestType, ['__v']));
  });
};

/**
 * Finding all testResult.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  TestTypeModel.find({}, function (err, TestType) {
    if (err) { return handleError(res, err); }
    if (!TestType) { return res.json(401); }
    res.status(200).json(TestType);
  });
};

/**
 * Deleting testResult by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id }; // Setting TestType ID with req.params.id
  TestTypeModel.findOneAndRemove(query, function (err, TestType) {
    if (err) { return handleError(res, err); }
    if (!TestType) { return res.json(401); }
    // Tracking log for testResult.
    var objHistory = {};
    objHistory.user = req.user.email;
    objHistory.action = 'Delete test type';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(TestType);
    objHistory.brief = 'Deleted result'
                      + '\nID: ' + TestType._id
                      + '\nResult: ' + TestType.result;
    trackTestResult(objHistory);
    // Return deleted TestType object
    res.status(200).json(_.omit(TestType.toObject(), ['__v']));
  });
};
