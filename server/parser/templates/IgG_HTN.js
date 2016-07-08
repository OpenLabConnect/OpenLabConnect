'use strict';
const TestModel = require('../../api/test/test.model');
const AnalyzerTestMap = require('../../api/analyzer-test-map/analyzer-test-map.model');

let Config = require('../config');
let Template = require('./template');
let Column = Config.CONST().column;

 module.exports = function templateIgGHTN (workSheet, template) {
  Template.apply(this, arguments);
  // Override variable
  this.templateConfig = {
    testCodeCell: { c: 1, r: 1 },
    testNameCell: {c: 5, r:4 },
    resultArea: {
      rowStart: 9,
      colOrder: 0,
      colAccessNumber: 4,
      colResult: 7,
      colOD: 5
    },
    tests: [{ name: 'HTN', id: '346'}]
  };

  // Override
  this.getTestMaps = function () {
    let testMaps = [],
      testNameCell = this.templateConfig.testNameCell,
      testName,
      testId,
      workSheet = this.workSheet,
      me = this;
    if (!this._getTestCode()) { return Promise.resolve(Config.CONST().errorMessage.testCodeDoesNotExists.code) }
    return AnalyzerTestMap.find({ testCode: this._getTestCode() })
    .populate('analyzer')
    .populate('test')
    .exec()
    .then(function (testMapRes) {
      // Test code invalids
      if (testMapRes.length === 0) {
        return Config.CONST().errorMessage.testCodeInvalid.code;
      }
      if (!testMapRes[0].test || !testMapRes[0].analyzer) {
        return Config.CONST().errorMessage.testMapIsNotFull.code;
      }
      testMaps[0] = testMapRes[0];
      testName = workSheet[Column[testNameCell.c] + testNameCell.r].w;
      for (let i = 0; i < me.templateConfig.tests.length; i++) {
        if (testName.trim() == me.templateConfig.tests[i].name) {
          testId = me.templateConfig.tests[i].id;
        }
      }
      return TestModel.findOne({ testId: testId })
      .exec()
      .then(function (test) {
        if (!test) { return Config.CONST().errorMessage.testMapIsNotFull.code;}
        testMaps[1] = {
          analyzer: testMapRes[0].analyzer,
          test: test
        };
        return testMaps;
      });
    });
  }
  this.getTestResults = function (template) {
    if (!this._checkWorkSheet()) { return false; }
  	let testResults = [],
    resultTable = this.templateConfig.resultArea;
    for (let r = resultTable.rowStart; ; r++) {
      let order = this.workSheet[Column[resultTable.colOrder] + r],
        accessionNumber = this.workSheet[Column[resultTable.colAccessNumber] + r],
        result = this.workSheet[Column[resultTable.colResult] + r],
        oDCell = this.workSheet[Column[resultTable.colOD] + r];
      if (!order || !accessionNumber || !result || !oDCell) {
        break;
      }
      let testResult = {},
        oD = oDCell.w;
      testResult.accessionNumber = accessionNumber.w;
      testResult.results = [
      { result: this._convertResult(result.w),
        type: Config.CONST().testType.result,
        testMapOrder: 0
      }, {
        result: oD,
        type: Config.CONST().testType.result.value,
        testMapOrder: 1
      }];
      testResults.push(testResult);
    }
    return testResults;
  }
 };
