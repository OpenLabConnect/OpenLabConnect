'use strict';
const AnalyzerTestMap = require('../../api/analyzer-test-map/analyzer-test-map.model');
const TestModel = require('../../api/test/test.model');

let Config = require('../config');
let Template = require('./template');
let column = Config.CONST().column;

 module.exports = function templateIgMJE (workSheet, template) {
  Template.apply(this, arguments);
  // Override variable
  this.templateConfig = {
    testCodeCell: { c: 1, r: 1 },
    tests: [
      { id: '344' },
      { id: '345' }
    ],
    // Address of Cut-off DEN: H7
    cutOff1Cell: { c: 8, r: 7 },
    // Address of Cut-of JE: N7
    cutOff2Cell: { c: 13, r: 7 },
    // TestResultArea
    resultArea: {
      rowStart: 11,
      colOrder: 0,
      colAccessNumber: 4,
      colTest1Result: 9,
      colTest1OD: 7,
      colTest2Result: 14,
      colTest2OD: 12,
      colResult: 16,
      colResultValue: 15
    }
  };
  // Override function
  this.getTestMaps = function () {
    let listPromise = [],
      testMaps = [],
      testId1 = this.templateConfig.tests[0].id,
      testId2 = this.templateConfig.tests[1].id,
      workSheet = this.workSheet,
      me = this;
    if (!this._getTestCode()) { return Promise.resolve(Config.CONST().errorMessage.testCodeDoesNotExists.code) }
    return AnalyzerTestMap.find({ testCode: me._getTestCode() })
    .populate('analyzer')
    .populate('test')
    .exec()
    .then(function (testMapsRes) {
      if (testMapsRes.length === 0) {
        return Config.CONST().errorMessage.testCodeInvalid.code;
      }
      testMaps[2] = testMapsRes[0];
      if (!testMaps[2].test || !testMaps[2].analyzer) {
        return Config.CONST().errorMessage.testMapIsNotFull.code;
      }

      listPromise[0] = TestModel.findOne({ testId: testId1 })
      .exec()
      .then(function (test) {
        if (!test) { return Config.CONST().errorMessage.testMapIsNotFull.code; }
        testMaps[0] = {
          analyzer: testMapsRes[0].analyzer,
          test: test
        };
      });
      listPromise[1] = TestModel.findOne({ testId: testId2 })
      .exec()
      .then(function (test) {
        if (!test) { return Config.CONST().errorMessage.testMapIsNotFull.code; }
        testMaps[1] = {
          analyzer: testMapsRes[0].analyzer,
          test: test
        };
      });
      return Promise.all(listPromise).then(function () {
        if (!testMaps[0] || !testMaps[1]) {
          return Config.CONST().errorMessage.fileMissingData.code;
        }
        return testMaps;
      });
    });
  }
  // Override
  this.getTestResults = function () {
    if (!this._checkWorkSheet()) { return false; }
  	let testResults = [],
        resultTable = this.templateConfig.resultArea,
        cutOffDENCell = this.templateConfig.cutOff1Cell,
        cutOffJECell = this.templateConfig.cutOff2Cell,
        cutOffDEN = this.workSheet[column[cutOffDENCell.c] + cutOffDENCell.r],
        cutOffJE = this.workSheet[column[cutOffJECell.c] + cutOffJECell.r];

    for (let r = resultTable.rowStart; ; r++) {
      let order = workSheet[column[resultTable.colOrder] + r],
        accessionNumber = workSheet[column[resultTable.colAccessNumber] + r],
        resultDEN = workSheet[column[resultTable.colTest1Result] + r],
        resultJE = workSheet[column[resultTable.colTest2Result] + r],
        result = workSheet[column[resultTable.colResult] + r],
        resultValue = workSheet[column[resultTable.colResultValue] + r];
      if (!order || !accessionNumber || !resultDEN || !resultJE || !result || !resultValue) {
        break;
      }
      let testResult = {},
        ODCODEN = workSheet[column[resultTable.colTest1OD] + r].w + '/' + cutOffDEN.w,
        ODCOJE = workSheet[column[resultTable.colTest2OD] + r].w + '/' + cutOffJE.w;
      testResult.accessionNumber = accessionNumber.w;
      testResult.results = [
        { result: this._convertResult(resultDEN.w),
          type: Config.CONST().testType.result,
          testMapOrder: 0
        }, {
          result: ODCODEN,
          type: Config.CONST().testType.value,
          testMapOrder: 0
        }, {
          result: this._convertResult(resultJE.w),
          type: Config.CONST().testType.result,
          testMapOrder: 1
        }, {
          result: ODCOJE,
          type: Config.CONST().testType.value,
          testMapOrder: 1
        }, {
          result: this._convertResult(result.w),
          type: Config.CONST().testType.result,
          testMapOrder: 2
        }, {
          result: resultValue.w,
          type: Config.CONST().testType.value,
          testMapOrder: 2
        }];
      testResults.push(testResult);
    }
    return testResults;
 }
};

