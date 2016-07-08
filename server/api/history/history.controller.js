'use strict';

var _ = require('lodash');

var HistoryModel = require('./history.model');

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
 * Creating new history in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  HistoryModel.create(req.body, function (err, history) {
    // Error handling
    if (err) { return handleError(res, err); }
    // Return history object which just have created
    res.status(201).json(_.omit(history.toObject(), ['__v']));
  });
};

/**
 * Updating history by ID.
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id }; // Setting history ID with req.params.id
  HistoryModel.findOneAndUpdate(query, req.body, function (err, history) {
    if (err) { return handleError(res, err); }
    if (!history) { return res.json(401); }
    // Return updated history
    res.status(200).json(_.omit(history.toObject(), ['__v']));
  });
};

/**
 * Finding history by ID.
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id; // Setting history ID with req.params.id
  HistoryModel.findById(id)
  .populate('analyzer')
  .populate('test')
  .populate('table')
  .exec(function (err, history) {
    // Error handling
    if (err) { return handleError(res, err); }
    if (!history) { return res.json(401); }
    // Return history object
    res.status(200).json(_.omit(history.toObject(), ['__v']));
  });
};

/**
 * Finding all history.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  var option = {};
  var select = {},
      selectTime = {};
  var filed = null;
  // Validation for req.query
  if (!_.isEmpty(req.query)) {
    var objQuery = {},
        objQueryAnalyzer = {},
        objOption = {};
    var exec = _.omit(req.query, ['page', 'limit']); // Remove 'page', 'limit' on criteria search
    _.forEach(exec, function (value, key) {
      // Setting search value when value not empty
      if (value !== '') {
        var date = '',
            dd = '',
            mm = '',
            yyyy = '';
        // Setting query fromDate
        if (key === 'fromDate') {
          date = new Date(_.parseInt(value));
          dd = date.getDate();
          mm = date.getMonth() + 1; // January is 0!
          yyyy = date.getFullYear();
          if (dd < 10) {
            dd = '0' + dd;
          }
          if (mm < 10) {
            mm = '0' + mm;
          }
          var fromDate = yyyy + '-' + mm + '-' + dd;
          objQuery.$gte = fromDate + 'T00:00:00Z';
          _.merge(selectTime, objQuery);
        }
        // Setting query toDate
        if (key === 'toDate') {
          date = new Date(_.parseInt(value));
          dd = date.getDate();
          mm = date.getMonth() + 1; // January is 0!
          yyyy = date.getFullYear();
          if (dd < 10) {
            dd = '0' + dd;
          }
          if (mm < 10) {
            mm = '0' + mm;
          }
          var toDate = yyyy + '-' + mm + '-' + dd;
          objQuery.$lte = toDate + 'T23:59:59Z';
          _.merge(selectTime, objQuery);
        }
        // Setting query analyzerId
        if (key === 'analyzerId') {
          objQueryAnalyzer.analyzer = value;
          _.merge(select, objQueryAnalyzer);
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
  // Setting query searchTimeStamp
  var searchTimeStamp = {};
  if (!_.isEmpty(selectTime)) {
    searchTimeStamp = {
      timestamp: selectTime
    };
  }
  var mergeSelect = _.merge(select, searchTimeStamp);
  HistoryModel.find(mergeSelect, filed, option).sort({ timestamp: -1 })
  .populate('analyzer')
  .populate('test')
  .populate('table')
  .exec(function (err, history) {
    // Error handling
    if (err) { return handleError(res, err); }
    if (!history) { return res.json(401); }
    HistoryModel.count(mergeSelect).exec(function (err, count) {
      if (err) { return handleError(res, err); }
      res.status(200).json({
        historyResult: history,
        totalHistoryResult: count
      });
    });
  });
};

/**
 * Deleting history by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id }; // Setting file analyzer ID with req.params.id
  HistoryModel.findOneAndRemove(query, function (err, history) {
    if (err) { return handleError(res, err); }
    if (!history) { return res.json(401); }
    // Return deleted history object
    res.status(200).json(_.omit(history.toObject(), ['__v']));
  });
};

