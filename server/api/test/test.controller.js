'use strict';

var _ = require('lodash');

var TestModel = require('./test.model');
var TableModel = require('../table/table.model');
var HistoryModel = require('../history/history.model');
var config = require('../../config/environment');
var conString = config.clinlimsGetLatestTest;
var logTest = {
  action_create: 'Create test',
  action_create_latest: 'Get latest test from LIS',
  action_update: 'Update test',
  action_delete: 'Delete test',
  brief_testID: 'Test ID from LIS',
  brief_test_name: 'Test name',
  brief_test_description: 'Test description',
  brief_test_range: 'Test normal range',
  brief_test_unit: 'Test unit',
  brief_test_section: 'Test section',
  brief_update_test_name: 'Update test name',
  brief_update_test_description: 'Update test description',
  brief_update_test_range: 'Update test normal range',
  brief_update_test_unit: 'Update test unit',
  brief_update_test_section: 'Update test section'
};
// Store procedure to get latest tests form openELIS 
var spGetLatestTests = 'SELECT * FROM sp_get_latest_tests()';

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
 * Tracking test
 * @param objHistory
 */
function trackTest (objHistory) {
  TableModel.findOne({ name: 'tests' }, function (err, table) {
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
 * Creating test in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  TestModel.create(req.body, function (err, test) {
    if (err) { return handleError(res, err); }
    // Tracking log for test.
    var objHistory = {};
    objHistory.test = test._id;
    objHistory.user = req.user.email;
    objHistory.action = logTest.action_create;
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(test);
    objHistory.brief = logTest.brief_testID + ': ' + test.testId
            + '\n' + logTest.brief_test_name + ': ' + test.name
            + '\n' + logTest.brief_test_description + ': ' + test.description
            + '\n' + logTest.brief_test_range + ': ' + test.normalRange
            + '\n' + logTest.brief_test_unit + ': ' + test.unit
            + '\n' + logTest.brief_test_section + ': '+ test.section;
    trackTest(objHistory);
    // Return test object which just have created
    res.status(201).json(_.omit(test.toObject(), ['__v']));
  });
};

/**
 * Updating test by ID.
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id }; // Setting test ID with req.params.id
  TestModel.findOneAndUpdate(query, req.body, function (err, test) {
    // Error handling
    if (err) { return handleError(res, err); }
    if (!test) { return res.json(401); }
    // Tracking log for test.
    var objHistory = {};
    objHistory.test = test._id;
    objHistory.user = req.user.email;
    objHistory.action = logTest.action_update;
    objHistory.timestamp = new Date();
    if (test.name !== req.body.name) {
      objHistory.brief += '\n' + logTest.brief_update_test_name + ' from: ' + test.name + ' to ' + req.body.name;
    }
    if (test.description !== req.body.description) {
      objHistory.brief += '\n' + logTest.brief_update_test_description+ ' from: ' + test.description + ' to ' + req.body.description;
    }
    if (test.normalRange !== req.body.normalRange) {
      objHistory.brief += '\n' + logTest.brief_update_test_range+ ' from: ' + test.normalRange + ' to ' + req.body.normalRange;
    }
    if (test.unit !== req.body.unit) {
      objHistory.brief += '\n' + logTest.brief_update_test_unit+ ' from: ' + test.unit + ' to ' + req.body.unit;
    }
    if (test.section !== req.body.section) {
      objHistory.brief += '\n' + logTest.brief_update_test_section+ ' from: ' + test.section + ' to ' + req.body.section;
    }
    objHistory.data = JSON.stringify(req.body);
    trackTest(objHistory);
    // Return updated test object
    res.status(200).json(_.omit(test.toObject(), ['__v']));
  });
};

/**
 * Finding test by ID.
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id; // Setting test ID with req.params.id
  TestModel.findById(id, function (err, test) {
    if (err) { return handleError(res, err); }
    if (!test) { return res.json(401); }
    // Return test object
    res.status(200).json(_.omit(test.toObject(), ['__v']));
  });
};
/***
 * Connect to openELIS system and get latest test by using sp_get_latest_tests()
 * @param {type} req
 * @param {type} res
 * @returns {Promise}
 */
function getlatestTest (req, res) {
  return new Promise(function (parentResolve, parentReject) {
    config.postgres.connect(conString, function (err, client, done) {
      if (err) {
        return parentReject(err);
      }
      client.query(spGetLatestTests, function (err, result) {
        done();
        if (err) {
          return parentReject(err);
        }
        var numberCreated = 0;
        var numberUpdated = 0;
        var promises = _.map(result.rows, function (row) {
          return new Promise(function (resolve) {
            var newRow = {
              name: row.test_name,
              description: row.test_description,
              normalRange: row.normal_range,
              unit: row.unit,
              section: row.test_section,
              testId: row.id
            };
            // Finding or Creating a test base on testId (this is test ID from openELIS)
            TestModel.findOrCreate({ testId: newRow.testId }, newRow, function (err, test, created) {
              if (err) { return handleError(res, err); }
              if (created) { // Creating new test
                numberCreated++; // Counting the number of creared test
                // Tracking log for test.
                var objHistory = {};
                objHistory.test = test._id;
                objHistory.user = req.user.email;
                objHistory.action = 'Get latest test from LIS';
                objHistory.timestamp = new Date();
                objHistory.data = JSON.stringify(test);
                objHistory.brief = logTest.brief_testID + ': ' + test.testId 
                        + '\n' + logTest.brief_test_name + ': ' + test.name
                        + '\n' + logTest.brief_test_description + ': ' + test.description
                        + '\n' + logTest.brief_test_range + ': ' + test.normalRange
                        + '\n' + logTest.brief_test_unit + ': ' + test.unit
                        + '\n' + logTest.brief_test_section + ': '+ test.section;
                trackTest(objHistory);
              } else { // Updating test
                // Updating test name
                var brief = '';
                if (test.name !== newRow.name) {
                  if (test.name === '') {
                    brief += '\n' + logTest.brief_update_test_name + ' : ' + newRow.name;
                  } else if (newRow.name === '') {
                    brief += '\n' + logTest.brief_update_test_name + ' : ' + test.name;
                  } else {
                    brief += '\n' + logTest.brief_update_test_name + ' from: ' + test.name + ' to ' + newRow.name;
                  }
                  test.name = newRow.name;
                }
                // Updating test description
                if (test.description !== newRow.description) {
                  if (test.description === '') {
                    brief += '\n' + logTest.brief_update_test_description + ' : ' + newRow.description;
                  } else if (newRow.description === '') {
                    brief += '\n' + logTest.brief_update_test_description + ' : ' + test.description;
                  } else {
                    brief += '\n' + logTest.brief_update_test_description+ ' from: ' + test.description + ' to ' + newRow.description;
                  }
                  test.description = newRow.description;
                }
                // Updating normal range
                if (test.normalRange !== newRow.normalRange) {
                  if (test.normalRange === '') {
                    brief += '\n' + logTest.brief_update_test_range + ' : ' + newRow.normalRange;
                  } else if (newRow.normalRange === '') {
                    brief += '\n' + logTest.brief_update_test_range + ' : ' + test.normalRange;
                  } else {
                    brief +=  '\n' + logTest.brief_update_test_range + ' from: ' + test.normalRange + ' to ' + newRow.normalRange;
                  }
                  test.normalRange = newRow.normalRange;
                }
                // Updating test unit
                if (test.unit !== newRow.unit) {
                  if (test.unit === '') {
                    brief += '\n' + logTest.brief_update_test_unit + ' : ' + newRow.unit;
                  } else if (newRow.unit === '') {
                    brief += '\n' + logTest.brief_update_test_unit + ' : ' + test.unit;
                  } else {
                    brief += '\n' + logTest.brief_update_test_unit+ ' from: ' + test.unit + ' to ' + newRow.unit;
                  }
                  test.unit = newRow.unit;
                }
                // Updating test section
                if (test.section !== newRow.section) {
                  if (test.section === '') {
                    brief += '\n' + logTest.brief_update_test_section + ' : ' + newRow.section;
                  } else if (newRow.section === '') {
                    brief += '\n' + logTest.brief_update_test_section + ' : ' + test.section;
                  } else {
                    brief += '\n' + logTest.brief_update_test_section+ ' from: ' + test.section + ' to ' + newRow.section;
                  }
                  test.section = newRow.section;
                }
                // Counting the number of updated test
                if (brief !== '') {
                  numberUpdated++;
                }
                test.save(function (err) {
                  if (err) { console.log(err); }
                   // Tracking log for updated test.
                  if (brief !== '') {
                    var objHistoryUpdatedTest = {};
                    objHistoryUpdatedTest.test = test._id;
                    objHistoryUpdatedTest.user = req.user.email;
                    objHistoryUpdatedTest.action = logTest.action_update;
                    objHistoryUpdatedTest.timestamp = new Date();
                    objHistoryUpdatedTest.data = JSON.stringify(newRow);
                    objHistoryUpdatedTest.brief = logTest.brief_testID + ': ' + test.testId;
                    objHistoryUpdatedTest.brief += brief;
                    trackTest(objHistoryUpdatedTest);
                  }
                });
              }
              resolve(test);
            });
          });
        });
        Promise.all(promises).then(function (tests) {
          var updateStatus = {
            numberCreated: numberCreated,
            numberUpdated: numberUpdated
          };
          parentResolve({ 
            tests: tests,
            updateStatus: updateStatus
          }) ;
        });
      });
    });
  });
}

/**
 * Finding all test.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  var option = {};
  var select = {};
  var filed = null;
  if (!_.isEmpty(req.query)) {
    var objOption = {};
    // Validation for option limit
    if (!_.isEmpty(req.query.limit)) {
      objOption.limit = _.parseInt(req.query.limit);
      _.merge(option, objOption);
    }
    // Validation for option page
    if (!_.isEmpty(req.query.page)) {
      var page = _.parseInt(req.query.page) - 1;
      objOption.skip =  option.limit * page;
      _.merge(option, objOption);
    }
    // Validation for query latest, If latest = true get latest form openELIS
    if (req.query.latest === 'true') {
      getlatestTest(req, res).then(function (responeTests) {
        TestModel.find(select, filed, option)
        .exec(function (err, test) {
          if (err) { return handleError(res, err); }
          if (!test) { return res.json(401); }
          // Get total test
          TestModel.count(select)
          .exec(function (err, count) {
            if (err) { return handleError(res, err); }
            res.status(200).json({
              testResult: test,
              totalTestResult: count,
              updateStatus: responeTests.updateStatus
            });
          });
        });
      }, function (err) {
        return handleError(res, err);
      });
    } else {
      TestModel.find(select, filed, option)
      .exec(function (err, test) {
        if (err) { return handleError(res, err); }
        if (!test) { return res.json(401); }
        // Get total test
        TestModel.count(select)
        .exec(function (err, count) {
          if (err) { return handleError(res, err); }
          res.status(200).json({
            testResult: test,
            totalTestResult: count
          });
        });
      });
    }
  } else {
    // Get tests from openAIM DB
    TestModel.find(select, filed, option)
    .exec(function (err, test) {
      if (err) { return handleError(res, err); }
      if (!test) { return res.json(401); }
      // Get total test
      TestModel.count(select)
      .exec(function (err, count) {
        if (err) { return handleError(res, err); }
        res.status(200).json({
          testResult: test,
          totalTestResult: count
        });
      });
    });
  }
};

/**
 * Deleting test by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id }; // Setting test ID with req.params.id
  TestModel.findOneAndRemove(query, function (err, test) {
    if (err) { return handleError(res, err); }
    if (!test) { return res.json(401); }
    // Tracking log for test.
    var objHistory = {};
    objHistory.test = test._id;
    objHistory.user = req.user.email;
    objHistory.action = logTest.action_delete;
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(test);
    objHistory.brief = logTest.brief_testID + ': ' + test.testId
            + '\n' + logTest.brief_test_name + ': ' + test.name
            + '\n' + logTest.brief_test_description + ': ' + test.description
            + '\n' + logTest.brief_test_range + ': ' + test.normalRange
            + '\n' + logTest.brief_test_unit + ': ' + test.unit
            + '\n' + logTest.brief_test_section + ': ' + test.section;
    trackTest(objHistory);
    // Return deleted test object
    res.status(200).json(_.omit(test.toObject(), ['__v']));
  });
};
