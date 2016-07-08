'use strict';

var _ = require('lodash');

var AnalyzerTestMapModel = require('./analyzer-test-map.model');
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
 * Tracking analyzerTestMap
 * @param objHistory
 */
function trackAnalyzerTestMap (objHistory) {
  TableModel.findOne({ name: 'analyzer-test-maps' }, function (err, table) {
    // Error handling when connect to Table Model
    if (err) {
      console.log(err);
    }
    objHistory.table = table._id; // Set 'analyzer-test-maps' table for history obj
    var history = new HistoryModel(objHistory);
    history.save(function (err) {
      // Error handling when save history obj into DB
      if (err) {
        console.log(err);
      }
    });
  });
}
/**
 * Creating new analyzerTestMap in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  // Validation analyzerTestMap data (req.body)
  if (!req.body) { return handleError(res, 'Test Map is empty.'); }
  // Validation analyzerTestMap data (req.body)
  if (!req.body.hasOwnProperty('analyzer') ||
      !req.body.hasOwnProperty('testCode') ||
      !req.body.hasOwnProperty('test')) { return handleError(res, 'Test Map is not full.'); }
  // Connecting to AnalyzerTestMapModel and create new AnalyzerTestMap 
  AnalyzerTestMapModel.create(req.body, function (err, analyzerTestMap) {
    // Error Handling
    if (err) { return handleError(res, err); }
    AnalyzerTestMapModel.findById(analyzerTestMap._id)
    .populate('analyzer') // Poplate ananyzer to get analyzer details
    .populate('test') // Poplate ananyzer to get test details
    .exec(function (err, analyzerTestMap) {
      // Error handling
      if (err) {return handleError(res, err); }
      if (!analyzerTestMap) { return res.json(401); }
      // Tracking log when creating new analyzerTestMap.
      var objHistory = {};
      objHistory.brief = 'Create new analyzer test map';
      // Seting analyzer and brief when updating analyzer
      if (analyzerTestMap.analyzer) {
        objHistory.analyzer = analyzerTestMap.analyzer;
        objHistory.brief += '\nAnalyzer: ' + analyzerTestMap.analyzer.name;
      }
      // Seting analyzer and brief when updating test
      if (analyzerTestMap.test) {
        objHistory.test = analyzerTestMap.test;
        objHistory.brief += '\nTest: ' + analyzerTestMap.test.name;
      }
      objHistory.brief += '\nTest code: ' + analyzerTestMap.testCode;
      objHistory.user = req.user.email;
      objHistory.action = 'Create analyzer test map';
      objHistory.timestamp = new Date();
      objHistory.data = JSON.stringify(analyzerTestMap);
      trackAnalyzerTestMap(objHistory);
      res.status(201).json(_.omit(analyzerTestMap.toObject(), ['__v']));
    });
  });
};

/**
 * Updating analyzerTestMap by ID.
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id };
  // Finding and updating AnalyzerTestMap by ID 
  AnalyzerTestMapModel.findOneAndUpdate(query, req.body)
  .populate('analyzer')
  .populate('test')
  .exec(function (err, analyzerTestMap) {
    // Error Handling
    if (err) { return handleError(res, err); }
    if (!analyzerTestMap) { return res.json(401); }
    // Tracking log for analyzerTestMap.
    var objHistory = {};
    objHistory.brief = 'Updated analyzer test map';
    // Seting analyzer
    if (analyzerTestMap.analyzer) {
      objHistory.analyzer = req.body.analyzer;
      // Seting brief when updating analyzer
      if (_.toString(analyzerTestMap.analyzer._id) !== _.toString(req.body.analyzer._id)) {
        objHistory.brief += '\nChanged analyzer from: ' + analyzerTestMap.analyzer.name + ' to ' + req.body.analyzer.name;
      }
    }
    // Seting test
    if (analyzerTestMap.test) {
      objHistory.test = req.body.test;
      // Seting brief when updating test
      if (_.toString(analyzerTestMap.test._id) !== _.toString(req.body.test._id)) {
        objHistory.brief += '\nChanged test from: ' + analyzerTestMap.test.name + ' to ' + req.body.test.name;
      }
    }
    // Seting brief when updating testCode
    if (analyzerTestMap.testCode !== req.body.testCode) {
      objHistory.brief += '\nChanged test code from: ' + analyzerTestMap.testCode + ' to ' + req.body.testCode;
    }
    objHistory.user = req.user.email;
    objHistory.action = 'Update analyzer test map';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(req.body);
    trackAnalyzerTestMap(objHistory);
    // Return updated analyzerTestMap object
    res.status(200).json(_.omit(analyzerTestMap.toObject(), ['__v']));
  });
};

/**
 * Finding analyzerTestMap by ID.
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id;
  // Connecting to AnalyzerTestMapModel and finding AnalyzerTestMap object by ID
  AnalyzerTestMapModel.findById(id)
  .populate('analyzer')
  .populate('test')
  .exec(function (err, analyzerTestMap) {
    // Error handling
    if (err) { return handleError(res, err); }
    if (!analyzerTestMap) { return res.json(401); }
    // Return analyzerTestMap object
    res.status(200).json(analyzerTestMap);
  });
};

/**
 * Finding all analyzerTestMap.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  var option = { limit: 0 };
  var select = {};
  var filed = null;
  // Validation for req.query
  if (!_.isEmpty(req.query)) {
    var objQuery = {},
        objOption = {};
    // Remove 'page', 'limit' on criteria search
    var exec = _.omit(req.query, ['page', 'limit']);
    _.forEach(exec, function (value, key) {
      if (value !== '') {
        if (key === 'search') {
          objQuery.name =  new RegExp(value, 'i'); // Search name with regex
          _.merge(select, objQuery);
        }
      }
    });
    // Validation for limit option
    if (!_.isEmpty(req.query.limit)) {
      objOption.limit = _.parseInt(req.query.limit);
      _.merge(option, objOption);
    }
    // Validation for page option
    if (!_.isEmpty(req.query.page)) {
      var page = _.parseInt(req.query.page) - 1;
      objOption.skip =  option.limit * page;
      _.merge(option, objOption);
    }
  }
  AnalyzerTestMapModel.find({}, filed)
  .populate({
    path: 'analyzer',
    match: select
  })
  .populate({
    path: 'test',
    match: select
  })
  .exec(function (err, analyzerTestMap) {
    if (err) { return handleError(res, err); }
    if (!analyzerTestMap) { return res.json(401); }
    var analyzerTestMapResultId = [];
    _.forEach(analyzerTestMap, function (value) {
      // Do not get analyzer test map with analy = null or test = null
      if (value.analyzer !== null || value.test !== null) {
        analyzerTestMapResultId.push(value._id);
      }
    });
    AnalyzerTestMapModel.find({ _id: { $in: analyzerTestMapResultId } }, filed, option)
    .populate('analyzer')
    .populate('test')
    .exec(function (err, analyzerTestMap) {
      if (err) { return handleError(res, err); }
      if (!analyzerTestMap) { return res.json(401); }
      res.status(200).json({
        analyzerTestMapResult: analyzerTestMap,
        totalAnalyzerTestMapResult: analyzerTestMapResultId.length
      });
    });
  });
};

/**
 * Deleting analyzerTestMap by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id };
  AnalyzerTestMapModel.findOneAndRemove(query)
  .populate('analyzer')
  .populate('test')
  .exec(function (err, analyzerTestMap) {
    // Error handling
    if (err) { return handleError(res, err); }
    if (!analyzerTestMap) { return res.json(401); }
    // Tracking log for analyzerTestMap.
    var objHistory = {};
    objHistory.brief = 'Deleted analyzer test map';
    if (analyzerTestMap.analyzer) {
      objHistory.analyzer = analyzerTestMap.analyzer;
      objHistory.brief += '\nAnalyzer: ' + analyzerTestMap.analyzer.name;
    }
    if (analyzerTestMap.test) {
      objHistory.test = analyzerTestMap.test;
      objHistory.brief += '\nTest: ' + analyzerTestMap.test.name;
    }
    objHistory.brief += '\nTest code: ' + analyzerTestMap.testCode;
    objHistory.user = req.user.email;
    objHistory.action = 'Delete analyzer test map';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(analyzerTestMap);
    trackAnalyzerTestMap(objHistory);
    // Return deleted analyzer test map
    res.status(200).json(_.omit(analyzerTestMap.toObject(), ['__v']));
  });
};
