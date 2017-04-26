'use strict';

/**
 * The parser for ABI7500Trioplex output
 */

const CONST = require('../../file-parser/config').CONST();
let ABI7500TrioplexConfig = CONST.ABI7500Trioplex;

function optimizedString(template, patientData) {
  let resultABI7500TrioplexwithPatient = {
    accessionNumber: '',
    testResults: []
  };
  let rowTestResult = patientData;
  let splitTestResults = rowTestResult.split(template.splitTestResult);
  if (splitTestResults[1]) { // Test result have accession numder
    let accessionNumber = splitTestResults[1];
    let testCode = splitTestResults[2];
    resultABI7500TrioplexwithPatient.accessionNumber = accessionNumber;
    if (testCode !== template.notTestResult) { // 'HSC'
      let testResult = {};
      let result = 0;
      let rawResult = splitTestResults[6];
      // If rawResult = 'Undetermined' convert to -1 (Negative)
      if (rawResult === template.UndeterminedResult) {
        result = -1;
      }
      if (!isNaN(rawResult)) {
        // If rawResult > 38 convert to -1 (Negative)
        if (parseFloat(rawResult) > template.qualitativeValue) {
          result = -1;
        }
        // If rawResult > 38 convert to 1 (Positive)
        if (parseFloat(rawResult) < template.qualitativeValue) {
          result = 1;
        }
      }
      testResult = {
        testCode: testCode,  
        result: result,
        type: CONST.testType.result
      };
      resultABI7500TrioplexwithPatient.testResults.push(testResult);
    }
  }
  return resultABI7500TrioplexwithPatient;
}
module.exports = function (analyzerOutput) {
  let resultABI7500 = [];
  let patients = analyzerOutput;
  let template = ABI7500TrioplexConfig;
  patients.map(function (patient) {
    if (patient.match(template.containtResult)) {
      let resultObj = {
        accessionNumber: '',
        testResults: [],
        analyzerName: ''
      };
      resultObj = optimizedString(template, patient);
      if (resultObj.testResults.length > 0) {
        resultObj.analyzerName = template.analyzerName;
        resultABI7500.push(resultObj);
      }
    }
  });
  return resultABI7500;
};