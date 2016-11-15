'use strict';

const XLSX = require('xlsx');
const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');

const TestResultModel = require('../api/test-result/test-result.model');
const TestTypeModel = require('../api/test-type/test-type.model');
const AnalyzerResultModel = require('../api/analyzer-result/analyzer-result.model');
const TableModel = require('../api/table/table.model');
const HistoryModel = require('../api/history/history.model');
const CONST = require('./config').CONST();
const ExcelTemplateHandler = require('./excel-template-handler');
const AsyTemplateHandler = require('./asy-template-handler');
const DateTimeUtil = require('../datetime-util/datetime-util');

function delegateError (error) {
  return error;
}
/**
 * Detected template of file upload
 * @param  {stirng} templateName
 * @return {object} template
 */
function detectedTemplate (templateName) {
  let template = templateName.split('-');
  for (let i = 0; i < CONST.templates.length; i++) {
    if (template[0] === CONST.templates[i].fileNamePattern) {
      return CONST.templates[i];
    }
  }
  return null;
}
/**
 * get TestCode and TestResults from file upload
 * @param  {string} fileName
 * @param  {string} directory [location of file]
 * @param  {object} template
 * @return {object} {testCode, testResults, worksheet}
 */
function getDataFromFileUpload (fileName, extName, directory, template, templateName, createDate) {
  if (template.fileNamePattern === 'Realtime.PCR') {
    // Case template is Asy but file type is not asy
    if (extName !== '.asy') {
      return Promise.reject(CONST.errorMessage.templateAndFileIsNotMap);
    }
    return AsyTemplateHandler.getData(fileName, directory, template, templateName, createDate);
  } else {
    // Case template is not Asy but file type is asy
    if (extName === '.asy') {
      return Promise.reject(CONST.errorMessage.templateAndFileIsNotMap);
    }
    let file = XLSX.readFile(directory + fileName),
      workSheet;
    // WorkSheet
    workSheet = file.Sheets[template.sheetName];
    // Get Data Package from file upload
    return ExcelTemplateHandler.getData(workSheet, template, createDate);
  }
}

/**
 * Create Test-Result History
 * @param  {ObjectId} table id of Test Results table
 * @param  {Object} testResult
 * @param  {Object} testMap
 * @return {Object} History model
 */
function createTestResultHistory (table, testResult, testMap) {
  // Create HistoryTest
  let testResultHistory = new HistoryModel({
    analyzer: testMap.analyzer._id,
    test: testMap.test._id,
    user: 'test@test.com',
    action: 'Create test result',
    timeStamp: Date.now(),
    data: JSON.stringify(testResult),
    table: table._id,
    brief: 'Create new result: ' +
      '\nID: ' + testResult._id +
      '\nResult: ' + testResult.result
  });
  return testResultHistory;
}

/**
 * Check test result is already an existing result
 */
function checkDuplicate (dataPackage) {
  let listPromise = [],
    date = DateTimeUtil.toUTC(dataPackage.beginDate);
  date = DateTimeUtil.toISO(date);
  let gte = date + 'T00:00:00Z';
  let lte = date + 'T23:59:59Z';
  let dataPackageLength = dataPackage.testResults.length;
  for (let i = 0; i < dataPackageLength; i++) {
    for (let j = 0; j < dataPackage.testResults[i].results.length; j++) {
      let testMapOrder = dataPackage.testResults[i].results[j].testMapOrder;
      let testMap = dataPackage.testMaps[testMapOrder];
      listPromise.push(AnalyzerResultModel
        .find({ accessionNumber: dataPackage.testResults[i].accessionNumber, test: testMap.test, beginDate: { $gte: gte, $lte: lte } })
        .populate({
          path: 'test',
          match: { testId: testMap.test.testId }
        })
        .populate({
          path: 'result',
          populate: {
            path: 'type'
          }
        })
        .exec()
        .then(function (analyzerResults) {
          if (analyzerResults.length > 0) {
            return analyzerResults;
          }
        }));
    }
  }
  return Promise.all(listPromise).then(function (all) {
    let mapArr = _.flatten(all);
    var resultFilter = [], dupArr = [];
    mapArr.map(function(dupResult) {
      if (dupResult) {
        resultFilter = _.filter(dataPackage.testResults, { 'accessionNumber':  dupResult.accessionNumber});
        if (resultFilter.length > 0) {
          dupArr.push(dupResult);
          _.remove(dataPackage.testResults, _.head(resultFilter));
          console.log(chalk.red(CONST.errorMessage.duplicateTestResult.description));
        }
      }
    });
    if (dupArr.length === dataPackageLength) {
      return Promise.reject(CONST.errorMessage.duplicateTestResult);
    }
    return dataPackage;
  });
}

/**
 * Create Analyzer Result
 * @param  {Object} testResult
 * @param  {string} accessionNumber
 * @param  {Object} testMap
 * @return {Object} analyzer result model
 */
function createAnalyzerResult(testResult, accessionNumber, testMap, beginDate, testType) {
  let analyzerResult = new AnalyzerResultModel({
    analyzer: testMap.analyzer._id,
    test: testMap.test._id,
    result: testResult._id,
    status: 'NEW',
    testType: testType,
    recievedDate: Date.now(),
    transferDate: null,
    lastUpdated: null,
    completedDate: null,
    accessionNumber: accessionNumber,
    beginDate: beginDate, // The date when staff start to do tests
    performedBy: testMap.analyzer.performedBy
  });
  return analyzerResult;
}
/**
 * Handle Saving TestResults into database
 * @param  {Object} data {testMaps, testResults, analyzerActived}
 * @return {[type]}      [description]
 */

function handleSaveTestResults(data) {
  let listPromise = [],
    testResultHistories = [],
    analyzerResults = [],
    beginDate = data.beginDate,
    testCodes = [],
    testType = null;
    if (data.testCode) {
      testCodes = data.testCode.split('-');
      testType = testCodes[1];
    }
  for (let i = 0; i < data.testResults.length; i++) {
    for (let j = 0; j < data.testResults[i].results.length; j++) {
      let type = data.testResults[i].results[j].type === 'result' ? data.testType.result : data.testType.value;
      let testResult = new TestResultModel({
        result: data.testResults[i].results[j].result,
        type: type
      });
      let testMapOrder = data.testResults[i].results[j].testMapOrder;
      // Insert TestResult into Database
      let saveTestResultPromise = testResult.save().then(function(testResult) {
        // Create TestResultHistories
        let testResultHistory = createTestResultHistory(data.table, testResult, data.testMaps[testMapOrder]);
        testResultHistories.push(testResultHistory);
        // Create AnalyzerResults
        let analyzerResult = createAnalyzerResult(testResult, data.testResults[i].accessionNumber, data.testMaps[testMapOrder], beginDate, testType);
        analyzerResults.push(analyzerResult);
      });
      listPromise.push(saveTestResultPromise);
    }
  }
  return Promise.all(listPromise).then(function() {
    console.log('[1/4]-INSERT Test Results: Success!');
    return ({
      testResultHistories: testResultHistories,
      analyzerResults: analyzerResults
    });
  });
}

function getTestType(data) {
  let testType = {};
  return TestTypeModel.find({}).exec()
    .then(function (testTypesRes) {
      testTypesRes.forEach(function (type) {
        if (type.name === 'result') {
          testType.result = type._id;
        } else {
          testType.value = type._id;
        }
      });
      data.testType = testType;
      return data;
    });
}

function saveTestResultsAndPrepareCollections(data) {
  return TableModel.findOne({ name: CONST.tableName.testResult }).exec()
    .then(function(table) {
      data.table = table;
      return getTestType(data)
        .then(handleSaveTestResults);
    }, delegateError);
}

function handleCollections(collections) {
  let listPromise = [];
  let saveAnalyzerResultPromise = AnalyzerResultModel.insertMany(collections.analyzerResults)
    .then(function(collection) {
      console.log('[2/4]-INSERT AnalyzerResult: Success!');
      return collection;
    });
  listPromise.push(saveAnalyzerResultPromise);
  let saveHistoryTestResultsPromise = HistoryModel.insertMany(collections.testResultHistories)
    .then(function() {
      console.log('[3/4]-LOG TestResults-History: Success!');
    });
  listPromise.push(saveHistoryTestResultsPromise);
  return Promise.all(listPromise).then(function(all) {
    collections.analyzerResults = all[0];
    return (collections);
  });
}

function briefHistoryResultConvert(result) {
  let briefResult = CONST.briefHistoryResultConvert;
  result = result.trim();
  for (let i = 0; i < briefResult.length; i++) {
    if (result === briefResult[i].result) {
      return briefResult[i].brief;
    }
  }
  return result;
}
/**
 * [createAnalyzerResultHistories description]
 * @param  {[type]} table      [description]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
function createAnalyzerResultHistories(table, collection) {
  let analyzerResults = collection.analyzerResults,
    analyzerResultHistorys = [],
    listPromise = [];

  listPromise = analyzerResults.map(function(result) {
    return AnalyzerResultModel.findById(result._id)
      .populate('test')
      .populate('analyzer')
      .populate('result')
      .exec()
      .then(function(analyzerResult) {
        let logTime = DateTimeUtil.toGMT(analyzerResult.receivedDate),
          beginDate = DateTimeUtil.toUTC(analyzerResult.beginDate),
          resultConvert = briefHistoryResultConvert(analyzerResult.result.result);
        // Tracking date when staff start to do tests
        let analyzerResultHistory = new HistoryModel({
          analyzer: analyzerResult.analyzer,
          test: analyzerResult.test,
          user: 'test@test.com',
          action: 'Create analyzer result',
          timeStamp: Date.now(),
          data: JSON.stringify(analyzerResult),
          table: table.id,
          brief: 'Accession Number: ' + analyzerResult.accessionNumber +
            '\nTest name: ' + analyzerResult.test.name +
            '\nTest Result: ' + resultConvert +
            '\nAnalyzer name: ' + analyzerResult.analyzer.name +
            '\nReceived date: ' + logTime +
            '\nBegin date: ' + beginDate +
            '\nTest Type: ' + analyzerResult.testType +
            '\nPerformed by: ' + analyzerResult.performedBy
        });
        analyzerResultHistorys.push(analyzerResultHistory);
      });
  });

  return Promise.all(listPromise).then(function() {
    collection.analyzerResultHistorys = analyzerResultHistorys;
    return collection;
  });
}
/**
 * Create History AnalyzerResults
 * @param  {Array} collection [{analyzerResult}]
 * @return {Array} History Model
 */
function createHistoryAnalyzerResults(collection) {
  return TableModel.findOne({ name: CONST.tableName.analyzerResult })
    .then(function(table) {
      return createAnalyzerResultHistories(table, collection);
    });
}
/**
 *Log History Analyzer Results into database
 * @param  {Array} historyCollection
 */
function logHistoryAnalyzerResults(collection) {
  return HistoryModel.insertMany(collection.analyzerResultHistorys)
    .then(function() {
      console.log('[4/4]-LOG AnalyzerResults-History: Success!');
      return collection;
    });
}

module.exports = function(fileName, extName, directory, templateName, beginDate) {
  let template = detectedTemplate(templateName);
  if (!template) {
    fs.unlinkSync(directory + fileName);
    return Promise.reject(CONST.errorMessage.templateUnderfined);
  }
  console.log('Template detected: ' + template.fileNamePattern);

  return getDataFromFileUpload(fileName, extName, directory, template, templateName)
    .then(function(dataPackage) {
      dataPackage.beginDate = beginDate ? beginDate : Date.now();
      return dataPackage;
    })
    .then(checkDuplicate)
    .then(saveTestResultsAndPrepareCollections)
    .then(handleCollections)
    .then(createHistoryAnalyzerResults)
    .then(logHistoryAnalyzerResults);
};