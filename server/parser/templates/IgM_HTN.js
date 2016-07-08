'use strict';
const AnalyzerTestMap = require('../../api/analyzer-test-map/analyzer-test-map.model');
const TestModel = require('../../api/test/test.model');

let Config = require('../config');
let Template = require('./template');
let column = Config.CONST().column;

 module.exports = function templateIgMHTN (workSheet, template) {
  Template.apply(this, arguments);
  // Override variable
  this.templateConfig = {
    testCodeCell: { c: 3, r: 2 },
    // Address of Test Name #1: F5
    testName1Cell: { c: 5, r: 5 },
    // Address of Test Name #2: K5
    testName2Cell: { c: 10, r: 5 },
    tests: [
      { name: 'HTN',
        id: '346'
      },
      { name: 'P24',
        id: '347'
      }],
    // TestResultArea
    resultArea: {
      rowStart: 10,
      colOrder: 0,
      colAccessNumber: 4,
      colTest1Result: 7,
      colTest2Result: 12,
      colOD: 15,
      colResult: 16
    }
  };
  //Override funciton
  this.getTestMaps = function () {
    let listPromise = [],
      testMaps = [],
      testName1,
      testId1,
      testName2,
      testId2,
      testName1Cell = this.templateConfig.testName1Cell,
      testName2Cell = this.templateConfig.testName2Cell,
      workSheet = this.workSheet,
      me = this;
    if (!this._getTestCode()) { return Promise.resolve(Config.CONST().errorMessage.testCodeDoesNotExists.code) }
    return AnalyzerTestMap.find({ testCode: this._getTestCode() })
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
      testName1 = workSheet[column[testName1Cell.c] + testName1Cell.r].w;
      testName2 = workSheet[column[testName2Cell.c] + testName2Cell.r].w;
      for (let i = 0; i < me.templateConfig.tests.length; i++) {
        if (testName1.trim() == me.templateConfig.tests[i].name) {
          testId1 = me.templateConfig.tests[i].id;
        }
        if (testName2.trim() == me.templateConfig.tests[i].name) {
          testId2 = me.templateConfig.tests[i].id;
        }
      }
      listPromise[0] = TestModel.findOne({ testId: testId1 })
      .exec()
      .then(function (test) {
        testMaps[0] = {
          analyzer: testMapsRes[0].analyzer,
          test: test
        };
      });
      listPromise[1] = TestModel.findOne({ testId: testId2 })
      .exec()
      .then(function (test) {
        testMaps[1] = {
          analyzer: testMapsRes[0].analyzer,
          test: test
        };
      });
      return Promise.all(listPromise).then(function () {
        return testMaps;
      });
    });
  }
  // Override
  this.getTestResults = function () {
    if (!this._checkWorkSheet()) { return false; }
  	let testResults = [],
    resultTable = this.templateConfig.resultArea;
    for (let r = resultTable.rowStart; ; r++) {
    let order = this.workSheet[column[resultTable.colOrder] + r],
      accessionNumber = this.workSheet[column[resultTable.colAccessNumber] + r],
      resultHTN = this.workSheet[column[resultTable.colTest1Result] + r],
      resultP24 = this.workSheet[column[resultTable.colTest2Result] + r],
      result = this.workSheet[column[resultTable.colResult] + r],
      oDCell = this.workSheet[column[resultTable.colOD] + r];
    if (!order || !accessionNumber || !resultHTN || !resultP24 || !result || !oDCell) {
      break;
    }
    let testResult = {},
      oD = oDCell.w;
    testResult.accessionNumber = accessionNumber.w;
    testResult.results = [
      { result: resultHTN.w,
        type: Config.CONST().testType.value,
        testMapOrder: 0
      }, {
        result: resultP24.w,
        type: Config.CONST().testType.value,
        testMapOrder: 1
      }, {
        result: this._convertResult(result.w),
        type: Config.CONST().testType.result,
        testMapOrder: 2
      }, {
        result: oD,
        type: Config.CONST().testType.value,
        testMapOrder: 2
      }];
    testResults.push(testResult);
  }
  return testResults;
  }
 };
