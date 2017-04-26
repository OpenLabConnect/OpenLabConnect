'use strict';

var _ = require('lodash');

var AnalyzerResultModel = require('./analyzer-result.model');
var mediatorLis = require('../mediator-lis');
var TableModel = require('../table/table.model');
var HistoryModel = require('../history/history.model');
// get config objects
var config = require('../../../mediator/config/config');
var apiConfig = config.api;
var DateTimeUtil = require('../../datetime-util/datetime-util');

var TEST_RESULT = 'result';
var TEST_RESULT_NEGATIVE = 'Negative';
var TEST_RESULT_POSITIVE = 'Positive';
var TEST_RESULT_UNKNOWN = 'Unknown';
var mapTestResult = {
  '-1': TEST_RESULT_NEGATIVE,
  '0': TEST_RESULT_UNKNOWN,
  '1': TEST_RESULT_POSITIVE
};

function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Tracking analyzerTestMap
 * @param objHistory
 */
function trackAnalyzerResult (objHistory) {
  TableModel.findOne({ name: 'analyzer-results' }, function (err, table) {
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

 // Check the results already exists
function checkDuplicate(analyzerResult) {
  let date = new Date(analyzerResult.beginDate);
    date = DateTimeUtil.toUTC(date);
    date = DateTimeUtil.toISO(date);
  let gte = date + 'T00:00:00Z';
  let lte = date + 'T23:59:59Z';

  return AnalyzerResultModel.find({ accessionNumber: analyzerResult.accessionNumber, test: analyzerResult.test, beginDate: { $gte: gte, $lte: lte } })
    .populate({
      path: 'test',
      match: { testId: analyzerResult.test.testId }
    })
    .populate({
      path: 'result',
      populate: {
        path: 'type'
      }
    })
    .exec()
    .then(function(result) {
      if (result.length !== 0) {
        return Promise.reject(analyzerResult);
      }
      return analyzerResult;
    });

}

/**
 * Creating new analyzerResultModel in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var result = req.body;
  checkDuplicate(result)
  .then(function(analyzerResult) {
    AnalyzerResultModel.create(analyzerResult, function (err, analyzerResult) {
      if (err) { return handleError(res, err); }
      AnalyzerResultModel.findById(analyzerResult._id)
      .populate('analyzer')
      .populate('test')
      .populate('result')
      .exec(function (err, analyzerResult) {
        if (err) { return handleError(res, err); }
        if (!analyzerResult) { return res.json(401); }
        // Tracking log for analyzerTestMap.
        AnalyzerResultModel.findById(analyzerResult._id)
        .populate('analyzer')
        .populate('test')
        .populate(
        {
          path: 'result',
          populate: {
            path: 'type'
          }
        })
        .exec(function (err, analyzerResultModel) {
          if (err) {return handleError(res, err); }
          if (!analyzerResultModel) { return res.json(401); }
          var objHistory = {};
          objHistory.brief = '';
          if (analyzerResult.accessionNumber) {
            objHistory.brief += '\nAccession Number: ' + analyzerResult.accessionNumber;
          }
          if (analyzerResult.test) {
            objHistory.test = analyzerResult.test;
            objHistory.brief += '\nTest name: ' + analyzerResult.test.name;
          }
          if (analyzerResult.result) {
            var convertTestResult = '';
            if (analyzerResult.result.type.name === TEST_RESULT) {
              convertTestResult = mapTestResult[analyzerResult.result.result];
              if (!convertTestResult) {
                convertTestResult = analyzerResult.result.result;
              }
            } else {
              convertTestResult = analyzerResult.result.result;
            }
            objHistory.brief += '\nTest Result: ' + convertTestResult;
          }
          if (analyzerResult.analyzer) {
            objHistory.analyzer = analyzerResult.analyzer;
            objHistory.brief += '\nAnalyzer name: ' + analyzerResult.analyzer.name;
          }
          objHistory.brief += '\nTest result status: ' + analyzerResult.status;
          if (analyzerResult.receivedDate) {
            var logTime = DateTimeUtil.toGMT(analyzerResult.receivedDate);
            objHistory.brief += '\nReceived date: ' + logTime;
          }
          if (analyzerResult.beginDate) {
            var beginDate = DateTimeUtil.toGMT(analyzerResult.beginDate);
            objHistory.brief += 'Begin date: ' + beginDate;
          }
          if (analyzerResult.performedBy) {
            objHistory.brief += 'Performed by: ' + analyzerResult.performedBy;
          }
          objHistory.user = req.user.email;
          objHistory.action = 'Create analyzer result';
          objHistory.timestamp = new Date();
          objHistory.data = JSON.stringify(analyzerResult);
          trackAnalyzerResult(objHistory);
        });
        res.status(201).json({success: true, data: _.omit(analyzerResult.toObject(), ['__v'])});
      });
    });
  }, function(analyzerResult) {
    return res.status(200).json({success: false, data: analyzerResult.accessionNumber});
  });
};

/**
 * Updating analyzerResult by ID
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id };
  // Updating accession number of test result
  if (req.body.accessionNumber) {
    var updateAccessionNumber = { accessionNumber: req.body.accessionNumber };
    AnalyzerResultModel.findOneAndUpdate(query, updateAccessionNumber, function (err, analyzerResult) {
      if (err) {
        return handleError(res, err);
      }
      if (!analyzerResult) { return res.json(401); }
      // Updating test results which have same accession number.
      var findTestResult = { accessionNumber: analyzerResult.accessionNumber };
      AnalyzerResultModel.update(findTestResult, updateAccessionNumber, { multi: true }, function (err) {
        if (err) {
          return {
            error_code: 1,
            error_detail:  handleError(res, err)
          };
        }
        // Tracking log for analyzerResult.
        var objHistory = {};
        objHistory.brief = 'Update accession number from ' + analyzerResult.accessionNumber + ' to ' + req.body.accessionNumber;
        objHistory.user = req.user.email;
        objHistory.action = 'Update test result';
        objHistory.timestamp = new Date();
        objHistory.data = JSON.stringify(updateAccessionNumber);
        trackAnalyzerResult(objHistory);
        res.status(200).json(
          {
            error_code: 0
          }
        );
      });
    });
  }
};

// Find analyzer results by ids
function findAnalyzerResult (ids, value) {
  return AnalyzerResultModel.find(ids)
  .populate('analyzer')
  .populate('test')
  .populate(
  {
    path: 'result',
    populate: {
      path: 'type'
    }
  })
  .exec()
  .then(function (analyzerResults) {
    return {
      analyzerResults: analyzerResults,
      value: value
    };
  });
}

// Find analyzer results by ids
function findAnalyzerResult2 (ids, value) {
  return AnalyzerResultModel.find({'_id': { $in: ids}})
  .populate('analyzer')
  .populate('test')
  .populate(
  {
    path: 'result',
    populate: {
      path: 'type'
    }
  })
  .exec()
  .then(function (analyzerResults) {
    return {
      analyzerResults: analyzerResults,
      value: value
    };
  });
}

// Create Unique analyzer results
function createUniqueAnalyzerResults (dataPackage) {
  var uniqueAnalyzerResult = [];
  dataPackage.analyzerResults.forEach(function (result) {
    if (result.accessionNumber.length == 10) {
      var isPair = _.every(uniqueAnalyzerResult,
        uniq => (uniq.accessionNumber !== result.accessionNumber || uniq.test !== result.test));
      if (isPair || _.isEmpty(uniqueAnalyzerResult)) { uniqueAnalyzerResult.push(result); }
    }
  });
  dataPackage.uniqueAnalyzerResult = uniqueAnalyzerResult;
  return dataPackage;
}

// Find analyzer had same testid and accessionnumber.
// Create data to import LIS
function createImportData (dataPackage) {
  var listPromise = [];
  listPromise = dataPackage.uniqueAnalyzerResult.map(function (uniqueResult) {
    var beginDate = DateTimeUtil.toUTC(uniqueResult.beginDate);
    var date = DateTimeUtil.toISO(beginDate);
    var gte = date + 'T00:00:00Z';
    var lte = date + 'T23:59:59Z';

    return AnalyzerResultModel
    .find({ accessionNumber: uniqueResult.accessionNumber, test: uniqueResult.test, beginDate: { $gte: gte, $lte: lte }})
    .populate(
    {
      path: 'analyzer',
      match: { _id: uniqueResult.analyzer._id }
    })
    .populate({
      path: 'test',
      match: { testId: uniqueResult.test.testId }
    })
    .populate({
      path: 'result',
      populate: {
        path: 'type'
      }
    })
    .exec().then(function (analyzerResult) {
      // Sorting AnalyzerResult by result type to handle case: AnalyzerResults have duplicate test type
      analyzerResult = _.sortedUniqBy(analyzerResult, _.property(uniqueResult.result.type.name));
      return Promise.resolve(analyzerResult);
    });
  });
  return Promise.all(listPromise).then(function(all) {
    dataPackage.totalAnalyzerResult = _.flatten(all).length;
    dataPackage.analyzerResults = all;
    delete dataPackage.uniqueAnalyzerResult;
    return dataPackage;
  });
}

// Import to LIS throught mediator
function importDataToELIS (dataPackage) {
  var listPromise = [];
  listPromise = dataPackage.analyzerResults.map(function (analyzerResults) {
    var transferResult = {};
    if (analyzerResults.length === 1) {
      transferResult.mainResult = analyzerResults[0];
    } else if (analyzerResults.length === 2) {
      // Prepare results before import
      var isdoubleSub = false;
      analyzerResults.forEach(function (analyzerResult) {
        if (analyzerResult.result.type.name === 'result') {
          transferResult.mainResult = analyzerResult;
        } else {
          if (!isdoubleSub) {
            transferResult.subResult = analyzerResult;
            isdoubleSub = true;
          } else {
            if (analyzerResult.result.value >= transferResult.subResult){
                 transferResult.mainResult = analyzerResult;
            } else {
                transferResult.mainResult = transferResult.subResult;
                transferResult.subResult = analyzerResult;
            }
          }
        }
      });
    } else {
      return Promise.reject('ANALYZER_RESULTS_INVALID');
    }
    return mediatorLis.importData(transferResult, apiConfig);
  });
  return Promise.all(listPromise).then(function (all){
    dataPackage.responseFromLIS = all;
    return dataPackage;
  });
}

// Check message from mediator
function checkResponse (dataPackage) {
  var messages = dataPackage.responseFromLIS;
  var transferSuccess = _.chain(messages)
    .filter({ success: 'success'})
    .map(_.property('transferedMediatorResults'))
    .flatten()
    .value();

  var countSuccess = _.chain(messages)
    .filter({ success: 'success'})
    .map(_.property('transferedMediatorResults'))
    .flatten()
    .value();

  var countFail = _.chain(messages)
    .filter({ success: 'fail'})
    .map(_.property('transferedMediatorResults'))
    .flatten()
    .value();
    
  dataPackage.transferSuccess = transferSuccess;
  dataPackage.success = countSuccess.length;
  dataPackage.fail = countFail.length;
  return dataPackage;
}

// Update status analyzer results
function updateStatus (dataPackage) {
  if (_.isEmpty(dataPackage.transferSuccess)) {
    return Promise.resolve(dataPackage);
  }

  var idsSuccess = _.map(dataPackage.transferSuccess, '_id');
  var ids = { _id: { $in: idsSuccess } };
  return AnalyzerResultModel.update(ids, dataPackage.value, { multi: true })
  .then(function () {
    return dataPackage;
  });
}

// Track history transfer analyzer results
function trackTransfer (dataPackage) {
  // If transferSuccess is empty pass this function
  if (_.isEmpty(dataPackage.transferSuccess)) {
    return dataPackage;
  }
  // Track history transfer Analyzer Result
  _.forEach(dataPackage.transferSuccess, function (analyzerResult) {
    var objHistory = {};
    objHistory.brief = '';
    if (analyzerResult.accessionNumber) {
      objHistory.brief += 'Accession Number: ' + analyzerResult.accessionNumber;
    }
    if (analyzerResult.test) {
      objHistory.test = analyzerResult.test;
      objHistory.brief += '\nTest name: ' + analyzerResult.test.name;
    }
    if (analyzerResult.result) {
      var convertTestResult = '';
      if (analyzerResult.result.type.name === TEST_RESULT) {
        convertTestResult = mapTestResult[analyzerResult.result.result];
        if (!convertTestResult) {
          convertTestResult = analyzerResult.result.result;
        }
      } else {
        convertTestResult = analyzerResult.result.result;
      }
      objHistory.brief += '\nTest Result: ' + convertTestResult;
    }

    if (analyzerResult.analyzer) {
      objHistory.analyzer = analyzerResult.analyzer;
      objHistory.brief += '\nAnalyzer name: ' + analyzerResult.analyzer.name;
    }
    if (analyzerResult.beginDate) {
      var beginDate = DateTimeUtil.toUTC(analyzerResult.beginDate);
      objHistory.brief += '\nBegin date: ' + beginDate;
    }
    if (dataPackage.value.status !== analyzerResult.status) {
      objHistory.brief += '\nTest result status was updated from ' + analyzerResult.status + ' to '  + dataPackage.value.status;
    }
    if (analyzerResult.transferDate) {
      var transferDate = DateTimeUtil.toGMT(analyzerResult.transferDate);
      objHistory.brief += '\nTransfer date: ' + transferDate;
    }
    if (analyzerResult.performedBy) {
      objHistory.brief += '\nPerformed by: ' + analyzerResult.performedBy;
    }
    objHistory.user = dataPackage.value.user.email;
    objHistory.action = 'Update test result and send data to Mediator';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(analyzerResult);
    trackAnalyzerResult(objHistory);
  });
  return dataPackage;
}
// Track history when analyzer result can not transfer into OpenELIS
function trackErrorTransfer (dataPackage) {
  var listPromise = [];
  _.filter(dataPackage.responseFromLIS, { success: 'fail' })
  .forEach(function (res) {
    _.forEach(res.transferedMediatorResults, function (analyzerResult) {
      var objHistory = {};
      objHistory.brief = '';
      if (analyzerResult.accessionNumber) {
        objHistory.brief += 'Accession Number: ' + analyzerResult.accessionNumber;
      }
      if (analyzerResult.test) {
        objHistory.test = analyzerResult.test;
        objHistory.brief += '\nTest name: ' + analyzerResult.test.name;
      }
      if (analyzerResult.result) {
        var convertTestResult = '';
        if (analyzerResult.result.type.name === TEST_RESULT) {
          convertTestResult = mapTestResult[analyzerResult.result.result];
          if (!convertTestResult) {
            convertTestResult = analyzerResult.result.result;
          }
        } else {
          convertTestResult = analyzerResult.result.result;
        }
        objHistory.brief += '\nTest Result: ' + convertTestResult;
      }

      if (analyzerResult.analyzer) {
        objHistory.analyzer = analyzerResult.analyzer;
        objHistory.brief += '\nAnalyzer name: ' + analyzerResult.analyzer.name;
      }
      if (analyzerResult.beginDate) {
        var beginDate = DateTimeUtil.toUTC(analyzerResult.beginDate);
        objHistory.brief += '\nBegin date: ' + beginDate;
      }
      if (analyzerResult.performedBy) {
        objHistory.brief += '\nPerformed by: ' + analyzerResult.performedBy;
      }
      objHistory.user = dataPackage.value.user.email;
      objHistory.action = 'Cannot Transfer data to Mediator.' + '\n' + res.error;
      objHistory.timestamp = new Date();
      objHistory.data = JSON.stringify(analyzerResult);
      trackAnalyzerResult(objHistory);
    });
  });
  return Promise.all(listPromise).then(function () {
    return dataPackage;
  });
}

// Prepare data and handle update, import data to LIS
function handleTransferResult (ids, value) {
  return findAnalyzerResult(ids, value)
    .then(createUniqueAnalyzerResults)
    .then(createImportData)
    .then(importDataToELIS)
    .then(checkResponse)
    .then(updateStatus)
    .then(trackTransfer)
    .then(trackErrorTransfer);
}
exports.handleTransferResult = handleTransferResult;
// Prepare data and handle update, import data to LIS
function handleAutoTransferResult (ids, value) {
  return findAnalyzerResult2(ids, value)
    .then(createUniqueAnalyzerResults)
    .then(createImportData)
    .then(importDataToELIS)
    .then(checkResponse)
    .then(updateStatus)
    .then(trackTransfer)
    .then(trackErrorTransfer);
}
exports.handleAutoTransferResult = handleAutoTransferResult;
/**
 * Updating analyzerResult by IDs.
 *
 * @param req
 * @param res
 */
exports.updateByIds = function (request, response) {
  var listIds = {},
    updateValues = {};
  if (!_.isEmpty(request.body.ids)) {
    // When user update on analyzer results by checkbox auto insert
    // Just tranfers analyzer result with status = 'NEW'
    if (typeof request.body.ids === 'string' && request.body.ids.toLowerCase() === 'all') {
      listIds = { status: 'NEW' };
    } else {
      listIds = { _id: { $in: request.body.ids } };
    }
  }
  if (!_.isEmpty(request.body.properties)) {
    updateValues = request.body.properties;
    updateValues.transferDate = Date.now();
    updateValues.lastUpdated = Date.now();
    updateValues.completedDate = Date.now();
    updateValues.user = request.user.email;
  }
  return handleTransferResult(listIds, updateValues).then(function (res) {
    if (response) {
      return response.status(200).json(res);
    }
  },function(err){
    console.log(err);
    if (response) {
      return handleError(response, err);
    }
  });
};
/**
 * Finding analyzerResult by ID
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id;
  AnalyzerResultModel.findById(id)
  .populate('analyzer')
  .populate('test')
  .populate(
  {
    path: 'result',
    populate: {
      path: 'type'
    }
  })
  .exec(function (err, analyzerResultModel) {
    if (err) { return handleError(res, err); }
    if (!analyzerResultModel) { return res.json(401); }
    res.status(200).json(analyzerResultModel);
  });
};

/**
 * Finding all analyzerResult
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  var option = {
    limit: 0,
    sort: {
      beginDate: -1, // Sort by receivedDate DESC
      accessionNumber: -1 // Sort by accessionNumber DESC
    }
  };
  var select = {};
  var filed = null;
  if (!_.isEmpty(req.query)) {
    var objQuery = {},
      objOption = {};
    var exec = _.omit(req.query, ['page', 'limit']);
    _.forEach(exec, function (value, key) {
      if (value !== '') {
        if (key === 'status') {
          value = value.toUpperCase();
          objQuery[key] = value;
          _.merge(select, objQuery);
        }
        if (key === 'beginDate') {
          var beginDate = DateTimeUtil.toISO(value);
          objQuery[key] = {
            $gte: beginDate + 'T00:00:00Z',
            $lte: beginDate + 'T23:59:59Z'
          };
          _.merge(select, objQuery);
        }
        if (key === 'accessionNumber') {
          objQuery.accessionNumber =  new RegExp(value, 'i');
          _.merge(select, objQuery);
        }
        if (key === 'analyzer') {
          objQuery.analyzer =  value;
          _.merge(select, objQuery);
        }
      }
    });
    if (!_.isEmpty(req.query.limit)) {
      objOption.limit = _.parseInt(req.query.limit);
      _.merge(option, objOption);
    }
    if (!_.isEmpty(req.query.page)) {
      var page = _.parseInt(req.query.page) - 1;
      objOption.skip =  option.limit * page;
      _.merge(option, objOption);
    }
  }
  var totalAnalyzerResult = 0;
  AnalyzerResultModel.find(select, filed, option)
  .populate('analyzer')
  .populate('test')
  .populate(
  {
    path: 'result',
    populate: {
      path: 'type'
    }
  })
  .exec(function (err, analyzerResult) {
    if (err) { return handleError(res, err); }
    if (!analyzerResult) { return res.json(401); }
    // Get total analyzer result
    AnalyzerResultModel.count(select).exec(function (err, count)
    {
      if (err) { return handleError(res, err); }
      totalAnalyzerResult = count;
      res.status(200).json({
        analyzerResult: analyzerResult,
        totalAnalyzerResult: totalAnalyzerResult
      });
    });
  });
};

/**
 * Deleting analyzerResult by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id };
  AnalyzerResultModel.findOneAndRemove(query, function (err, analyzerResult) {
    if (err) { return handleError(res, err); }
    if (!analyzerResult) { return res.json(401); }
    // Tracking log for analyzerTestMap.
    var objHistory = {};
    objHistory.brief = '';
    if (analyzerResult.accessionNumber) {
      objHistory.brief += 'Accession Number: ' + analyzerResult.accessionNumber;
    }
    if (analyzerResult.test) {
      objHistory.test = analyzerResult.test;
      objHistory.brief += '\nTest name: ' + analyzerResult.test.name;
    }
    if (analyzerResult.result) {
      objHistory.brief += '\nResult: ' + analyzerResult.result.result;
    }
    if (analyzerResult.analyzer) {
      objHistory.analyzer = analyzerResult.analyzer;
      objHistory.brief += '\nAnalyzer name: ' + analyzerResult.analyzer.name;
    }
    if (analyzerResult.receivedDate) {
      var receivedDate = DateTimeUtil.toGMT(analyzerResult.receivedDate);
      objHistory.brief += '\nReceived date: ' + receivedDate;
    }
    if (analyzerResult.performedBy) {
      objHistory.brief += '\nPerformed by: ' + analyzerResult.performedBy;
    }
    objHistory.user = req.user.email;
    objHistory.action = 'Delete analyzer result';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(analyzerResult);
    trackAnalyzerResult(objHistory);
    res.status(200).json(_.omit(analyzerResult.toObject(), ['__v']));
  });
};

/**
 * Deleting analyzerResult by IDs
 *
 * @param req
 * @param res
 */
exports.deleteByIds = function (req, res) {
  var _ids = {};
  if (!_.isEmpty(req.body.ids)) {
    _ids = req.body.ids;
  }
  AnalyzerResultModel.find({ _id: { $in: _ids } })
  .populate('analyzer')
  .populate('test')
  .populate('result')
  .exec().then(function (analyzerResult) {
    _.forEach(analyzerResult, function (value) {
      var objHistory = {};
      objHistory.brief = '';
      if (value.accessionNumber) {
        objHistory.brief += 'Accession Number: ' + value.accessionNumber;
      }
      if (value.test) {
        objHistory.test = value.test;
        objHistory.brief += '\nTest name: ' + value.test.name;
      }
      if (value.result) {
        objHistory.brief += '\nResult: ' + value.result.result;
      }
      if (value.analyzer) {
        objHistory.analyzer = value.analyzer;
        objHistory.brief += '\nAnalyzer name: ' + value.analyzer.name;
      }
      if (value.receivedDate) {
        var receivedDate = DateTimeUtil.toGMT(analyzerResult.receivedDate);
        objHistory.brief += '\nReceived date: ' + receivedDate;
      }
      if (value.performedBy) {
        objHistory.brief += '\nPerformed by: ' + value.performedBy;
      }
      objHistory.user = req.user.email;
      objHistory.action = 'Delete analyzer result';
      objHistory.timestamp = new Date();
      objHistory.data = JSON.stringify(value);
      trackAnalyzerResult(objHistory);
    });
  }).then(function () {
    AnalyzerResultModel.find({ _id: { $in: _ids } }).remove().exec()
    .then(function (result) {
      res.status(200).json(result);
    });
  })
  .catch(function (err) {
    return handleError(res, err);
  });
};
