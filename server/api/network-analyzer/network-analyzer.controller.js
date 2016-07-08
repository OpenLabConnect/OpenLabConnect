'use strict';

var _ = require('lodash');

var NetworkAnalyzerModel = require('./network-analyzer.model');
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
 * Tracking network analyzer
 * @param objHistory
 */
function trackAnalyzerNetwork (objHistory) {
  TableModel.findOne({ name: 'network-analyzers' }, function (err, table) {
    // Error handling
    if (err) {
      console.log(err);
    }
    objHistory.table = table._id;
    var history = new HistoryModel(objHistory);
    history.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
  });
}

/**
 * Creating new networkAnalyzer in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  NetworkAnalyzerModel.create(req.body, function (err, networkAnalyzer) {
    if (err) { return handleError(res, err); }
    // Tracking log for analyzer network.
    var objHistory = {};
    objHistory.analyzer = networkAnalyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Create network analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(networkAnalyzer);
    objHistory.brief = 'Create new network analyzer: ' + networkAnalyzer.name;
    trackAnalyzerNetwork(objHistory);
    // Return networkAnalyzer object which just have created
    res.status(201).json(_.omit(networkAnalyzer.toObject(), ['__v']));
  });
};

/**
 * Updating networkAnalyzer by ID.
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id }; // Setting networkAnalyzer ID with req.params.id
  NetworkAnalyzerModel.findOneAndUpdate(query, req.body, function (err, networkAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!networkAnalyzer) { return res.json(401); }
    // Tracking log for analyzer network.
    var objHistory = {};
    objHistory.analyzer = networkAnalyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Updating network analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(req.body);
    objHistory.brief = 'Updated network analyzer: ' + networkAnalyzer.name;
    trackAnalyzerNetwork(objHistory);
    // Return updated networkAnalyzer object
    res.status(200).json(_.omit(networkAnalyzer.toObject(), ['__v']));
  });
};

/**
 * Finding networkAnalyzer by ID.
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id; // Setting networkAnalyzer ID with req.params.id
  NetworkAnalyzerModel.findById(id, function (err, networkAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!networkAnalyzer) { return res.json(401); }
    // Return networkAnalyzer object
    res.status(200).json(_.omit(networkAnalyzer.toObject(), ['__v']));
  });
};

/**
 * Finding all networkAnalyzer.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  NetworkAnalyzerModel.find({}, function (err, networkAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!networkAnalyzer) { return res.json(401); }
    res.status(200).json(networkAnalyzer);
  });
};

/**
 * Deleting networkAnalyzer by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id }; // Setting networkAnalyzer ID with req.params.id
  NetworkAnalyzerModel.findOneAndRemove(query, function (err, networkAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!networkAnalyzer) { return res.json(401); }
    // Tracking log for analyzer network.
    var objHistory = {};
    objHistory.analyzer = networkAnalyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Delete network analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(networkAnalyzer);
    objHistory.brief = 'Deleted network analyzer: ' + networkAnalyzer.name;
    trackAnalyzerNetwork(objHistory);
    // Return deleted networkAnalyzer object
    res.status(200).json(_.omit(networkAnalyzer.toObject(), ['__v']));
  });
};
