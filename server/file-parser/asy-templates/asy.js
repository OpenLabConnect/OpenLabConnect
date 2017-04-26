'use strict';
const Test = require('../../api/test/test.model');
const Analyzer = require('../../api/analyzer/analyzer.model');
const AnalyzerTestMap = require('../../api/analyzer-test-map/analyzer-test-map.model');
const _ = require('lodash');
let CONST = require('../config').CONST();
let asyConfig = CONST.asy;

/**
 * Get TestMap from testcode
 * @param  {string} testCode
 * @return testMaps
 */
function getAnalyzer(dataPackage) {
  return Analyzer.findOne({ name: asyConfig.analyzerName })
    .exec()
    .then(function(analyzer) {
      dataPackage.analyzer = analyzer;
      return dataPackage;
    });
}

function getTest(dataPackage) {
  return Test.findOne({ testId: dataPackage.testId })
    .exec()
    .then(function(test) {
      dataPackage.test = test;
      return dataPackage;
    });
}

function getTestMap(dataPackage) {
  let id = dataPackage.analyzer.id;
  return AnalyzerTestMap.find({ testCode: dataPackage.testCode, analyzer: id})
    .populate('analyzer')
    .populate('test')
    .exec()
    .then(function(testMaps) {
      // Test code invalids
      if (testMaps.length === 0) {
        return Promise.reject(CONST.errorMessage.testCodeInvalid);
      }
      return {
        testMaps: testMaps,
        testResults: dataPackage.testResults,
        testCode: dataPackage.testCode
      };
    });
}

/**
 * Get test map and test results from file upload
 * @param  {string} data
 * @return {Object} dataPackage
 */
exports.getData = function(data, templateName) {
  let testResults = [],
    testCode,
    testType,
    testResult = {};

  // template = templateName.split('-');
  // let [testCode, testCodeSub, testType] = templateName.split('-');
  // let [testCode, testCodeSub, testType] = templateName.split('-');
  let templates = templateName.split('-');
  testCode = templates[0] + '-' + templates[1];
  testType = templates[2];

  // testCode = template[1];
  // testType = template[2];

  for (let i in data) {
    let accessionNumberKey = asyConfig.accessionNumber,
      resultKey = asyConfig.result;

    if (data[i].search(accessionNumberKey) > -1) {
      testResult.accessionNumber = data[i].substring(accessionNumberKey.length);
      continue;
    }
    if (data[i].search(resultKey) > -1) {
      let rawResult = data[i].substring(resultKey.length);
      // Convert result with qual qualitative template
      if (testType === asyConfig.qualitative) {
        if (rawResult === '' || parseFloat(rawResult) > asyConfig.qualitativeValue || rawResult === '-') {
          // If rawResult is a '' or '-' convert to -1 (Negative)
          rawResult = -1;
        } else if (parseFloat(rawResult) < asyConfig.qualitativeValue) {
          // If rawResult is larger than qualitative (38) convert to 1 (Positive)
          rawResult = 1;
        } else {
          // Convert to 0 (underfined)
          rawResult = 0;
        }
      } else if (testType === asyConfig.quantitative) {
        // Convert result with SYBR template
        if (rawResult === '' || rawResult === '-') {
          // If rawResult is a '' or '-' convert to -1 (Negative)
          rawResult = -1;
        } else if (!isNaN(rawResult)) {
          // If rawResult is a number convert to 1 (Positive)
          rawResult = 1;
        } else {
          // Convert to 0 (underfined)
          rawResult = 0;
        }
      }
      testResult.results = [{
        result: rawResult,
        type: CONST.testType.result,
        testMapOrder: 0
      }];
      let firstTestResult = _.find(testResults, { accessionNumber: testResult.accessionNumber });
      if (!firstTestResult) {
        testResults.push(testResult);
      } else {
        // Check second result !== first result. If true remove all both result.
        if (firstTestResult.results[0].result !== testResult.results[0].result) {
          _.remove(testResults, { accessionNumber: firstTestResult.accessionNumber });
        }
      }
      testResult = {};
    }
  }

  let dataPackage = {};
  dataPackage.testResults = testResults;
  dataPackage.testCode = testCode;

  return getAnalyzer(dataPackage)
    .then(getTest)
    .then(getTestMap);
};