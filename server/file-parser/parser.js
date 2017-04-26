'use strict';

const XLSX = require('xlsx');
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
const tXtTemplateHandler = require('./txt-template-handler');
const cSvTemplateHandler = require('./csv-template-handler');
const AnalyzerModel = require('../api/analyzer/analyzer.model');
const AnalyzerTestMap = require('../api/analyzer-test-map/analyzer-test-map.model');
const DateTimeUtil = require('../datetime-util/datetime-util');
var analyzerResultController = require('../api/analyzer-result/analyzer-result.controller');
var SettingModel = require('../api/setting/setting.model');
var log4js = require('log4js');
var fs = require('fs-extra');

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
 * Get data from uploaded text file
 * @param {type} fileName
 * @param {type} extName
 * @param {type} directory
 * @param {type} template
 * @param {type} templateName
 * @param {type} createDate
 * @param {type} logAnalyzer
 * @returns {Promise}
 */
function getDataFromFileTxtUpload (fileName, extName, directory, template, templateName, createDate, logAnalyzer) {
  // Case template is txt but file type is not txt
  if (extName !== '.txt') {
    return Promise.reject(CONST.errorMessage.templateAndFileIsNotMap);
  } else {
    return findByName(template.analyzerName).then(function(analyzer) {
      // Checking analyzer status
      if (analyzer.actived === false) {
        return Promise.reject(CONST.errorMessage.analyzerIsNotActive);
      } else {
        Promise.resolve();
      }
    }).then(function() {
      return tXtTemplateHandler.getData(fileName, directory, template, templateName, createDate);
    }).then(function (dataPackage) {
      dataPackage.map(function (parsedResult) {
        logAnalyzer.info('Parsed data: \n', parsedResult);
      });
      return dataPackage;
    }).then(function(analyzerResults) {
      // Checking parsed data, if parsed data <= 0 -> Not found accession number,
      // testResults, analyzerName -> system do not support this template.
      if (analyzerResults && analyzerResults.length <= 0) {
        return Promise.reject(CONST.errorMessage.templatesWasNotFound);
      } else {
        return analyzerResults;
      }
    }).then(function (analyzerResults) {
      return importDataToOpenLabConnect(analyzerResults, createDate, logAnalyzer);
    }).catch(function (error) {
      return Promise.reject(error);
    });
  }
}
/**
 * Get data from uploaded csv file
 * @param {type} fileName
 * @param {type} extName
 * @param {type} directory
 * @param {type} template
 * @param {type} templateName
 * @param {type} createDate
 * @param {type} logAnalyzer
 * @returns {Promise}
 */
function getDataFromFileCsvUpload (fileName, extName, directory, template, templateName, createDate, logAnalyzer) {
  // Case template is csv but file type is not csv
  if (extName !== '.csv') {
    return Promise.reject(CONST.errorMessage.templateAndFileIsNotMap);
  } else {
    return findByName(template.analyzerName).then(function(analyzer) {
      // Checking analyzer status
      if (analyzer.actived === false) {
        return Promise.reject(CONST.errorMessage.analyzerIsNotActive);
      } else {
        Promise.resolve();
      }
    }).then(function() {
      return cSvTemplateHandler.getData(fileName, directory, template, templateName, createDate);
    }).then(function (dataPackage) {
      dataPackage.map(function (parsedResult) {
        logAnalyzer.info('Parsed data: \n', parsedResult);
      });
      return dataPackage;
    }).then(function(analyzerResults) {
      // Checking parsed data, if parsed data <= 0 -> Not found accession number,
      // testResults, analyzerName -> system do not support this template.
      if (analyzerResults && analyzerResults.length <= 0) {
        return Promise.reject(CONST.errorMessage.templatesWasNotFound);
      } else {
        return analyzerResults;
      }
    }).then(function (analyzerResults) {
      return importDataToOpenLabConnect(analyzerResults, createDate, logAnalyzer);
    }).catch(function (error) {
      return Promise.reject(error);
    });
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
/***
 * Transfer test result to LIS
 * Checking 'auto-insert' = true.
 * @param {type} collection
 * @param {type} logAnalyzer
 */
function handleTransferToLIS(collection, logAnalyzer) {
  SettingModel.findOne({ key: 'auto-insert' })
  .exec(function (err, setting) {
    if (err) { return console.log(err); }
    if (!setting) { return console.log('Not found auto-insert seting'); }
    if (setting.value === 'true') { // Auto transfer test results to LIS
      let listIds = collection.filter(function(testResult) 
      {
        return (testResult.accessionNumber.length === 10 && testResult.status === 'NEW'); 
      }).map(_.property('_id'));
      let updateValues = {};
      updateValues.status = 'TRANSFERRED';
      updateValues.transferDate = Date.now();
      updateValues.lastUpdated = Date.now();
      updateValues.completedDate = Date.now();
      updateValues.user = 'admin';
      if (listIds.length > 0) {
        analyzerResultController.handleAutoTransferResult(listIds, updateValues).then(function () {
          console.log('TRANSFER AnalyzerResult: Success!');
          logAnalyzer.info('TRANSFER AnalyzerResult: '+ collection[0].accessionNumber, listIds);
        }).catch(function (error) {
          console.log(error);
          logAnalyzer.info('TRANSFER AnalyzerResult: '+ collection[0].accessionNumber, error);
        });
      }
    }
  });
}
function findByName(name) {
  // Finding analyzer by name
  return AnalyzerModel.findOne({ name: name }).exec();
}
/**
 * Get TestMap from testcode
 * @param  {Object} dataPackage
 * @return {Object} dataPackage with testMaps
 */
function getTestMap(dataPackage) {
  let logAnalyzer = dataPackage.logAnalyzer;
  logAnalyzer.info('getTestMap() - ' + dataPackage.accessionNumber +  '  - Start');
  let id;
  let listTestMapsPromise = [];
  // Sorting testResults by testCode to handle case: One testCode have multiple testResult
  let groupByTestCode = _.sortedUniqBy(dataPackage.testResults, _.property('testCode'));
  return findByName(dataPackage.analyzerName).then(function (analyzer) {
    id = analyzer._id;
    groupByTestCode.map(function (testResult) {
      listTestMapsPromise.push(AnalyzerTestMap.find({ testCode: testResult.testCode, analyzer: id})
        .populate('analyzer')
        .populate('test')
        .exec()
        .then(function(testMaps) {
          if (testMaps.length === 0) {
            logAnalyzer.info(CONST.errorMessage.testCodeInvalid.description, testResult.testCode);
          }
          return testMaps;
        }));
    });
    return Promise.all(listTestMapsPromise).then(function(testMaps) {
      let testMapLength = testMaps.length;
      let testMapsRes = _.flattenDeep(testMaps);
      if (testMapsRes.length === 0 || testMapLength > testMapsRes.length) {  
        console.log(chalk.red(CONST.errorMessage.testCodeInvalid.description));
      }
      logAnalyzer.info('Test Map: ' + dataPackage.accessionNumber, testMapsRes);
      logAnalyzer.info('getTestMap() - ' + dataPackage.accessionNumber +  ' - End');
      dataPackage.testMaps = testMapsRes;
      dataPackage.logAnalyzer = logAnalyzer;
      return dataPackage;
    });
  });
}
/**
 * Check test result is already an existing result
 */
function checkDuplicate (dataPackage) {
  let logAnalyzer = dataPackage.logAnalyzer;
  logAnalyzer.info('checkDuplicate() - Start');
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
            // Transfer test result to LIS
            // Logic: If user checked 'Auto insert' after upload file.
            // In the next upload, sytem will transfer test results which
            // have uploaded before, in other words it is duplicated test result.
            handleTransferToLIS(analyzerResults, logAnalyzer);
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
          resultFilter.map(function (itemResultFilter) {
            logAnalyzer.info('Duplicate result: ' + dupResult.accessionNumber, itemResultFilter);
          });
        }
      }
    });
    if (dupArr.length === dataPackageLength) {
      logAnalyzer.info(CONST.errorMessage.duplicateTestResult);
      logAnalyzer.info('End parser');
      return Promise.reject(CONST.errorMessage.duplicateTestResult);
    }
    logAnalyzer.info('checkDuplicate() - End');
    return dataPackage;
  });
}
/**
 * Check test result is already an existing result
 */
function checkDuplicateWithTestMap(dataPackage) {
  let logAnalyzer = dataPackage.logAnalyzer;
  logAnalyzer.info('checkDuplicate() - ' + dataPackage.accessionNumber +  '  - Start');
  let listPromise = [],
    date = DateTimeUtil.toUTC(dataPackage.beginDate);
  date = DateTimeUtil.toISO(date);
  let gte = date + 'T00:00:00Z';
  let lte = date + 'T23:59:59Z';
  for (let i = 0; i < dataPackage.testMaps.length; i++) {
    listPromise.push(AnalyzerResultModel
      .find({
        accessionNumber: dataPackage.accessionNumber,
        test: dataPackage.testMaps[i].test,
        beginDate: { $gte: gte, $lte: lte }
      })
      .populate({
        path: 'test',
        match: { testId: dataPackage.testMaps[i].test.testId }
      })
      .populate({
        path: 'result',
        populate: {
          path: 'type'
        }
      })
      .exec()
      .then(function(analyzerResults) {
        if (analyzerResults){
          if (analyzerResults.length > 0) {
            dataPackage.testMaps[i] = null;
            return analyzerResults;
          }
        }
      }, delegateError));
  }
  return Promise.all(listPromise).then(function(all) {
    let mapArr = _.flatten(all);
    let flagDuplicated = false;
    mapArr.map(function(dupTestMap) {
      if (dupTestMap) {
        logAnalyzer.info('Duplicate result: ' + dataPackage.accessionNumber, dupTestMap);
        // Transfer test result to LIS
        // Logic: If user checked 'Auto insert' after upload file.
        // In the next upload, sytem will transfer test results which
        // have uploaded before, in other words it is duplicated test result.
        let collection= [];
        collection.push(dupTestMap);
        handleTransferToLIS(collection, logAnalyzer);
        console.log(chalk.red(CONST.errorMessage.duplicateTestResult.description));
        flagDuplicated = true;
      }
    });
    logAnalyzer.info('checkDuplicate() - ' + dataPackage.accessionNumber +  '  - End');
    dataPackage.flagDuplicated = flagDuplicated;
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
  let logAnalyzer = data.logAnalyzer;
  logAnalyzer.info('handleSaveTestResults() - Start');
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
    logAnalyzer.info('handleSaveTestResults() - End');
    return ({
      testResultHistories: testResultHistories,
      analyzerResults: analyzerResults,
      logAnalyzer: logAnalyzer
    });
  });
}
function handleSaveTestResultsWithTestMap(data) {
  let logAnalyzer = data.logAnalyzer;
  logAnalyzer.info('handleSaveTestResults() - ' + data.accessionNumber +  '  - Start');
  let listPromise = [],
    testResultHistories = [],
    analyzerResults = [],
    beginDate = data.beginDate,
    testResult;
  let emptyTestMap = true;
  for (let i = 0; i < data.testMaps.length; i++) {
    if (data.testMaps[i] !== null) {
      let testResultsFilter = _.filter(data.testResults, { 'testCode':  data.testMaps[i].testCode});
      if (testResultsFilter.length > 0) {
        testResultsFilter.map(function (testRes) {
         let type = testRes.type === 'result' ? data.testType.result : data.testType.value;
          testResult = new TestResultModel({
            result: testRes.result,
            type: type
          });
          // Insert TestResult into Database
          let saveTestResultPromise = testResult.save().then(function(testResult) {
            // Create TestResultHistories
            let testResultHistory = createTestResultHistory(data.table, testResult, data.testMaps[i]);
            testResultHistories.push(testResultHistory);
            // Create AnalyzerResults
            let analyzerResult = createAnalyzerResult(testResult, data.accessionNumber, data.testMaps[i], beginDate);
            analyzerResults.push(analyzerResult);
          });
          listPromise.push(saveTestResultPromise);
        });
      }
      emptyTestMap = false;
    }
  }
  if (emptyTestMap) {
    logAnalyzer.info('No test result was saved');
    logAnalyzer.info('handleSaveTestResults() - ' + data.accessionNumber +  ' - End');
    logAnalyzer.info('End parser');
    if (data.flagDuplicated) {
      return Promise.reject(CONST.errorMessage.duplicateTestResult);
    } else {
      return Promise.reject(CONST.errorMessage.testCodeInvalid);
    }
  } else {
    return Promise.all(listPromise).then(function() {
      console.log('[1/4]-INSERT Test Results: Success!');
      logAnalyzer.info('handleSaveTestResults() - ' + data.accessionNumber +  ' - End');
      return ({
        testResultHistories: testResultHistories,
        analyzerResults: analyzerResults,
        logAnalyzer: logAnalyzer
      });
    });
  }
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
function saveTestResultsAndPrepareCollectionsWithTestMap(data) {
  return TableModel.findOne({ name: CONST.tableName.testResult }).exec()
    .then(function(table) {
      data.table = table;
      return getTestType(data)
        .then(handleSaveTestResults);
    }, delegateError);
}
function saveTestResultsAndPrepareCollectionsWithTestMap(data) {
  return TableModel.findOne({ name: CONST.tableName.testResult }).exec()
    .then(function(table) {
      data.table = table;
      return getTestType(data)
        .then(handleSaveTestResultsWithTestMap);
    }, delegateError);
}

function handleCollections(collections) {
  let logAnalyzer = collections.logAnalyzer;
  logAnalyzer.info('handleCollections() - Start');
  let listPromise = [];
  let saveAnalyzerResultPromise = AnalyzerResultModel.insertMany(collections.analyzerResults)
    .then(function(collection) {
      console.log('[2/4]-INSERT AnalyzerResult: Success!');
      logAnalyzer.info('INSERT AnalyzerResul: ', collection);
      return collection;
    });
  listPromise.push(saveAnalyzerResultPromise);
  let saveHistoryTestResultsPromise = HistoryModel.insertMany(collections.testResultHistories)
    .then(function() {
      console.log('[3/4]-LOG TestResults-History: Success!');
      logAnalyzer.info('LOG TestResults-History: Success!');
    });
  listPromise.push(saveHistoryTestResultsPromise);
  return Promise.all(listPromise).then(function(all) {
    logAnalyzer.info('handleCollections() - End');
    collections.analyzerResults = all[0];
    return (collections);
  });
}
function handleCollectionsWithTestMap(collections) {
  let logAnalyzer = collections.logAnalyzer;
  logAnalyzer.info('handleCollections() - ' + collections.analyzerResults[0].accessionNumber +  ' - Start');
  if (collections.success === false) {
    return collections;
  }
  let listPromise = [];
  let saveAnalyzerResultPromise = AnalyzerResultModel.insertMany(collections.analyzerResults)
    .then(function(collection) {
      console.log('[2/4]-INSERT AnalyzerResult: Success!');
      logAnalyzer.info('INSERT AnalyzerResult: '+ collections.analyzerResults[0].accessionNumber, collection);
      // Transfer test result to LIS
      handleTransferToLIS(collection, logAnalyzer);
      return collection;
    });
  listPromise.push(saveAnalyzerResultPromise);
  let saveHistoryTestResultsPromise = HistoryModel.insertMany(collections.testResultHistories)
    .then(function() {
      console.log('[3/4]-LOG TestResults-History: Success!');
      logAnalyzer.info('LOG TestResults-History: Success!'+ collections.analyzerResults[0].accessionNumber);
    });
  listPromise.push(saveHistoryTestResultsPromise);

  return Promise.all(listPromise).then(function(all) {
    collections.analyzerResults = all[0];
    logAnalyzer.info('handleCollections() - ' + collections.analyzerResults[0].accessionNumber +  ' - End');
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
  let logAnalyzer = collection.logAnalyzer;
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
    logAnalyzer.info('createHistoryAnalyzerResults() - End');
    return collection;
  });
}
function createAnalyzerResultHistoriesWithTestMap(table, collection) {
  let logAnalyzer = collection.logAnalyzer;
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
            '\nPerformed by: ' + analyzerResult.performedBy
        });
        analyzerResultHistorys.push(analyzerResultHistory);
      });
  });
  return Promise.all(listPromise).then(function() {
    collection.analyzerResultHistorys = analyzerResultHistorys;
    logAnalyzer.info('createHistoryAnalyzerResults() - ' + collection.analyzerResults[0].accessionNumber +  ' - End');
    return collection;
  });
}
/**
 * Create History AnalyzerResults
 * @param  {Array} collection [{analyzerResult}]
 * @return {Array} History Model
 */
function createHistoryAnalyzerResults(collection) {
  let logAnalyzer = collection.logAnalyzer;
  logAnalyzer.info('createHistoryAnalyzerResults() - Start');
  return TableModel.findOne({ name: CONST.tableName.analyzerResult })
    .then(function(table) {
      return createAnalyzerResultHistories(table, collection);
    });
}
function createHistoryAnalyzerResultsWithTestMap(collection) {
  let logAnalyzer = collection.logAnalyzer;
  logAnalyzer.info('createHistoryAnalyzerResults() - ' + collection.analyzerResults[0].accessionNumber +  ' - Start');
  return TableModel.findOne({ name: CONST.tableName.analyzerResult })
    .then(function(table) {
      return createAnalyzerResultHistoriesWithTestMap(table, collection);
    });
}
/**
 *Log History Analyzer Results into database
 * @param  {Array} historyCollection
 */
function logHistoryAnalyzerResults(collection) {
  let logAnalyzer = collection.logAnalyzer;
  logAnalyzer.info('logHistoryAnalyzerResults() - Start');
  return HistoryModel.insertMany(collection.analyzerResultHistorys)
    .then(function() {
      console.log('[4/4]-LOG AnalyzerResults-History: Success!');
      logAnalyzer.info('logHistoryAnalyzerResults() - End');
      return collection;
    });
}
function logHistoryAnalyzerResultsWithTestMap(collection) {
  let logAnalyzer = collection.logAnalyzer;
  logAnalyzer.info('logHistoryAnalyzerResults() - ' + collection.analyzerResults[0].accessionNumber +  ' - Start');
  return HistoryModel.insertMany(collection.analyzerResultHistorys)
    .then(function() {
      console.log('[4/4]-LOG AnalyzerResults-History: Success!');
      logAnalyzer.info('logHistoryAnalyzerResults() - ' + collection.analyzerResults[0].accessionNumber +  ' - End');
      return collection;
    });
}
function logAnalyzerInput (analyzerName) {
  let logDirectoryAnalyzers = './server/logs/files/' + analyzerName ;
  if (!fs.existsSync(logDirectoryAnalyzers)) {
    fs.mkdirsSync(logDirectoryAnalyzers);
  }
  log4js.configure({
    appenders: [
      { 
        type: 'file',
        absolute: true,
        filename: logDirectoryAnalyzers + '/' +analyzerName + '.log',
        maxLogSize: 2048000, //2Mb
        category: 'analyzer-input'
      }
    ]
  });
  return log4js.getLogger('analyzer-input');
}
function importDataToOpenLabConnect(analyzerResults, beginDate, logAnalyzer) {
  let listPromise = analyzerResults.map(function (dataPackage) {
    dataPackage.beginDate = beginDate ? beginDate : Date.now();
    dataPackage.logAnalyzer = logAnalyzer;
    return getTestMap(dataPackage)
    .then(checkDuplicateWithTestMap)
    .then(saveTestResultsAndPrepareCollectionsWithTestMap)
    .then(handleCollectionsWithTestMap)
    .then(createHistoryAnalyzerResultsWithTestMap)
    .then(logHistoryAnalyzerResultsWithTestMap);
  });
  return Promise.all(listPromise).then(function(resolveData) {
    logAnalyzer.info('End parser');
    return Promise.resolve(resolveData);
  }).catch(function (error) {
    return Promise.reject(error);
  });
}
module.exports = function(fileName, extName, directory, templateName, beginDate) {
  let template = detectedTemplate(templateName);
  if (!template) {
    fs.unlinkSync(directory + fileName);
    return Promise.reject(CONST.errorMessage.templateUnderfined);
  }
  console.log('Template detected: ' + template.fileNamePattern);
  let logAnalyzer = logAnalyzerInput(templateName);
  logAnalyzer.info('Start parser');
  // Checking txt file to redirect to new parser.
  if (CONST.TXTFile.indexOf(template.fileNamePattern) > -1) {
    return getDataFromFileTxtUpload(fileName, extName, directory, template, templateName, beginDate, logAnalyzer);
  } else if (CONST.CSVFile.indexOf(template.fileNamePattern) > -1) {// Checking csv file to redirect to csv parser.
    return getDataFromFileCsvUpload(fileName, extName, directory, template, templateName, beginDate, logAnalyzer);
  } else {
    return getDataFromFileUpload(fileName, extName, directory, template, templateName, beginDate, logAnalyzer)
    .then(function(dataPackage) {
      logAnalyzer.info('Parsed testMaps: \n', dataPackage.testMaps);
      dataPackage.testResults.map(function (testResult) {
        logAnalyzer.info('Parsed testResults: ' + testResult.accessionNumber + '\n', testResult.results);
      });
      dataPackage.beginDate = beginDate ? beginDate : Date.now();
      dataPackage.logAnalyzer = logAnalyzer;
      return dataPackage;
    })
    .then(checkDuplicate)
    .then(saveTestResultsAndPrepareCollections)
    .then(handleCollections)
    .then(createHistoryAnalyzerResults)
    .then(logHistoryAnalyzerResults)
    .then(function(resolveData) {
      logAnalyzer.info('End parser');
      return Promise.resolve(resolveData);
    });
  }
};