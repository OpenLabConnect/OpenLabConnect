'use strict';

/**
 * The parser for Phoenix100 output
 */

const CONST = require('../../file-parser/config').CONST();

/**
 * Get test section ID (/\^{3}ID\^/) 
 * @param {type} template
 * @param {type} str
 * @returns {getSectionId.testID|String}
 */
function getSectionId(template, str) {
  let testID = '';
  let strTestID = str.match(template.matchSectionTestID)[0].length;
  let endTestID = str.match(template.matchInstComplete).index;
  testID =  str.substring(strTestID, endTestID);
  return testID;
}
/**
 * Get test result
 * @param {type} template
 * @param {type} str
 * @returns {testResults}
 */
function getTestResult(template, str) {
  let endTestCodeIndx = str.match(template.matchInstComplete);
  let strTestResult = endTestCodeIndx.index + endTestCodeIndx[0].length;
  let endTestResult = str.match(template.matchEndTestResult).index;
  let testResults = str.substring(strTestResult, endTestResult);
  testResults = testResults.replace(template.matchEnterLine, '');
  testResults = testResults.split(template.splitTestResult);
  
  return testResults;
}
function optimizedString(template, analyzerOutput) {
  let parserStr = analyzerOutput.split(template.splitLine);
  let testSectionID = '';
  let resultPhoenix100 = {
    accessionNumber: '',
    testResults: []
  };
  parserStr.map(function (str) {
  str = str.replace(template.replaceSymbol, '');
  if (str.match(template.containtId)) {
    let accessionNumRows = str.split(template.splitAccNumber);
      accessionNumRows.map(function(row) {
        if (row.match(template.containtId)) {
          let strAccessionNum = row.match(template.containtId)[0].length;
          let endAccessionNum = row.match(template.matchSymbolHat).index;
          resultPhoenix100.accessionNumber = row.substring(strAccessionNum, endAccessionNum);
        }
      });
    }
    else {
      // Get test section ID
      if (str.match(template.matchSectionTestID)) {
        testSectionID =  getSectionId(template, str);
      } else if (str.match(template.matchAstMic) && testSectionID !== '') { // Get test result
        let strTestResultPattern = template.matchAstMicStr + testSectionID + template.matchSymbolHatStr;
        strTestResultPattern = new RegExp(strTestResultPattern);
        let strTestCode = str.match(strTestResultPattern)[0].length;
        let endTestCode = str.match(template.matchInstComplete).index;
        let testCode = str.substring(strTestCode, endTestCode);
        let testResults = [];
        testResults = getTestResult(template, str);
        testResults.map(function (testResult) {
          let parserResult = {};
          parserResult.testCode = testCode;
          parserResult.result = testResult;
          parserResult.type = CONST.testType.result;
          if (testResult.match(template.matchNumber)) {
            parserResult.type = CONST.testType.value;
          }
          resultPhoenix100.testResults.push(parserResult);
        });
      }
    }
  });
  return resultPhoenix100;
}
module.exports = function (template, analyzerOutput) {
  let resultPhoenix100 = [];
  let patients = analyzerOutput.split(template.splitPatient);
  patients.map(function (patient) {
    if (patient.match(template.containtId)) {
      let resultObj = {};
      resultObj = optimizedString(template, patient);
      resultObj.analyzerName = template.name;
      resultPhoenix100.push(resultObj);
    }
  });
  return resultPhoenix100;
};
