'use strict';

var _ = require('lodash');

var FileAnalyzerModel = require('./file-analyzer.model');
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
 * Tracking file analyzer
 * @param objHistory
 */
function trackAnalyzerFile (objHistory) {
  TableModel.findOne({ name: 'file-analyzers' }, function (err, table) {
    // Error handling
    if (err) {
      console.log(err);
    }
    objHistory.table = table._id;
    var history = new HistoryModel(objHistory);
    history.save(function (err) {
      // Error handling
      if (err) {
        console.log(err);
      }
    });
  });
}
/**
 * Creating new fileAnalyzer in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  FileAnalyzerModel.create(req.body, function (err, fileAnalyzer) {
    // Error handling
    if (err) { return handleError(res, err); }
    // Tracking log for file analyzer.
    var objHistory = {};
    objHistory.analyzer = fileAnalyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Create file analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(fileAnalyzer);
    objHistory.brief = 'Create new file analyzer: ' + fileAnalyzer.name;
    trackAnalyzerFile(objHistory);
    // Return file analyzer which just have created
    res.status(201).json(_.omit(fileAnalyzer.toObject(), ['__v']));
  });
};

/**
 * Updating fileAnalyzer by ID.
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id }; // Setting file analyzer ID with req.params.id
  FileAnalyzerModel.findOneAndUpdate(query, req.body, function (err, fileAnalyzer) {
    // Error handling
    if (err) { return handleError(res, err); }
    if (!fileAnalyzer) { return res.json(401); }
    // Tracking log for file analyzer.
    var objHistory = {};
    objHistory.analyzer = fileAnalyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Update file analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(req.body);
    objHistory.brief = 'Updated file analyzer: ' + fileAnalyzer.name;
    trackAnalyzerFile(objHistory);
    // Return updated file analyzer
    res.status(200).json(_.omit(fileAnalyzer.toObject(), ['__v']));
  });
};

/**
 * Finding fileAnalyzer by ID.
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id; // Setting file analyzer ID with req.params.id
  FileAnalyzerModel.findById(id, function (err, fileAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!fileAnalyzer) { return res.json(401); }
    // Return file analyzer
    res.status(200).json(_.omit(fileAnalyzer.toObject(), ['__v']));
  });
};

/**
 * Finding all fileAnalyzer.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  FileAnalyzerModel.find({}, function (err, fileAnalyzer) {
    if (err) { return handleError(res, err); }
    if (!fileAnalyzer) { return res.json(401); }
    res.status(200).json(fileAnalyzer);
  });
};

/**
 * Deleting fileAnalyzer by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id };
  FileAnalyzerModel.findOneAndRemove(query, function (err, fileAnalyzer) {
    // Error handling
    if (err) { return handleError(res, err); }
    if (!fileAnalyzer) { return res.json(401); }
    // Tracking log for file analyzer.
    var objHistory = {};
    objHistory.analyzer = fileAnalyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Delete file analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(fileAnalyzer);
    objHistory.brief = 'Deleted file analyzer: ' + fileAnalyzer.name;
    trackAnalyzerFile(objHistory);
    res.status(200).json(_.omit(fileAnalyzer.toObject(), ['__v']));
  });
};
