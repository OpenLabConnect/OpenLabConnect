'use strict';
const AnalyzerTestMap = require('../../api/analyzer-test-map/analyzer-test-map.model');
const Config = require('../config');
const Analyzer = require('../../api/analyzer/analyzer.model');
let Column = Config.CONST().column;

 module.exports = function template (workSheet) {
  this.workSheet = workSheet;
  this.templateConfig = {};
  // Protected Function
  this._checkWorkSheet = function () {
    if (!this.workSheet) { return false; }
    return true;
  };
  this._getTestCode = function () {
    let rawTestCode = this.workSheet[Column[this.templateConfig.testCodeCell.c] + this.templateConfig.testCodeCell.r];
    if (!rawTestCode) {return false;}
    return (rawTestCode.w.slice(18)).trim();
  };
  // Protected Function
  this._convertResult = function (result) {
    let resultConvert = Config.CONST().resultConvert;
    result = result.trim();
    for (let i = 0; i < resultConvert.length; i++) {
      if (result === resultConvert[i].key) {
        return resultConvert[i].result;
      }
    }
  };

  this.getTestMaps = function () {
    let check = true;
    if (!this._getTestCode()) { return Promise.resolve(Config.CONST().errorMessage.testCodeDoesNotExists.code); }
    return AnalyzerTestMap.find({ testCode: this._getTestCode()})
    .populate('analyzer')
    .populate('test')
    .exec()
    .then(function (testMaps) {
      // Test code invalids
      if (testMaps.length === 0) {
        return Config.CONST().errorMessage.testCodeInvalid.code;
      }
      testMaps.forEach(function (testMap) {
        if (!testMap.test || !testMap.analyzer) {
          check = false;
          return false; // Break ForEach loop
        }
      });
      if (!check) {
        // Return response error: test map is not full.
        return Config.CONST().errorMessage.testMapIsNotFull.code;
      }
      return testMaps;
    });
  };

  this.getTestResults = function () {
    if (!this._checkWorkSheet()) { return false; }
    let testResults = [],
      resultTable = this.templateConfig.resultArea,
      cutOffCell = this.templateConfig.cutOffCell,
      cutOff = this.workSheet[Column[cutOffCell.c] + cutOffCell.r];
    for (let r = resultTable.rowStart; ; r++) {
      let order = this.workSheet[Column[resultTable.colOrder] + r],
        accessionNumber = this.workSheet[Column[resultTable.colAccessNumber] + r],
        result = this.workSheet[Column[resultTable.colResult] + r];
      if (!order || !accessionNumber || !result) {
        break;
      }
      let testResult = {},
        ODCO = this.workSheet[Column[resultTable.colOD] + r].w + '/' + cutOff.w;
      testResult.accessionNumber = accessionNumber.w;
      testResult.results = [
      { result: this._convertResult(result.w),
        type: Config.CONST().testType.result,
        testMapOrder: 0
      }, {
        result: ODCO,
        type: Config.CONST().testType.result.value,
        testMapOrder: 0
      }];
      testResults.push(testResult);
    }
    return testResults;
  };
 };
