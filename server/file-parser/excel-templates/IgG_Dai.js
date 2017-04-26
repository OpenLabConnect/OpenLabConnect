'use strict';
let Config = require('../config');
let Template = require('./template');
let Column = Config.CONST().column;

 module.exports = function templateNS1Den (workSheet, template) {
  Template.apply(this, arguments);
  // Override variable
  this.templateConfig = {
    testCodeCell: { c: 4, r: 2 },
    cutOff: 0.3,
    // TestResultsArea
    resultArea: {
      rowStart: 20,
      colOrder: 0,
      colAccessNumber: 2,
      colResult: 9,
      colOD: 8
    }
  };
  // Override
  this.getTestResults = function () {
    if (!this._checkWorkSheet()) { return false; }
    let testResults = [],
      resultTable = this.templateConfig.resultArea,
      cutOff = this.templateConfig.cutOff;
    for (let r = resultTable.rowStart; ; r++) {
      let order = this.workSheet[Column[resultTable.colOrder] + r],
        accessionNumber = this.workSheet[Column[resultTable.colAccessNumber] + r],
        result = this.workSheet[Column[resultTable.colResult] + r],
        oDCell = this.workSheet[Column[resultTable.colOD] + r];
      if (!order || !accessionNumber || !result || !oDCell) {
        break;
      }
      let testResult = {},
        ODCO = oDCell.w + '/' + cutOff;
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
