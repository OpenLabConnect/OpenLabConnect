'use strict';

/**
 * The parser for GeneXpert.389.VKL output
 */

const CONST = require('../../file-parser/config').CONST();
let GeneXpert389MTBConfig = CONST.GeneXpert389MTB;

function optimizedString(template, patientData) {
  let splitOpticalData = patientData.split(template.splitOpticalData);
  // 
  if (splitOpticalData.length > 1) {
    patientData = splitOpticalData[0];
  }
  let resultGeneXpert389MTBwithPatient = {
    accessionNumber: '',
    testResults: []
  };
  let splitPatientData = patientData.split(template.splitPatientData);
  let accessionNumber = '';
  let testResult = {};
  let firstAccessionNumber = true;
  splitPatientData.map(function (rowPatienData) {
    let splitRowPatienData = rowPatienData.split(template.splitRowPatienData);
    // Get accession number
    if (firstAccessionNumber) {
      if (rowPatienData.match(template.containtAccessionNumber)) {
        accessionNumber = splitRowPatienData[1];
      }
      if (rowPatienData.match(template.containtAccessionNumber2)) {
        if (splitRowPatienData[1]) {
          accessionNumber = splitRowPatienData[1].substring(0, 10);
        }
        firstAccessionNumber = false;
      }
    }
    // Get test result
    if (rowPatienData.match(template.containtTestResult)) {
      let result = splitRowPatienData[1];
      testResult = {
        testCode: template.testCode,
        result: result,
        type: CONST.testType.result
      };
    }
  });
  // Adding accession number
  resultGeneXpert389MTBwithPatient.accessionNumber = accessionNumber;
  // Adding test result
  resultGeneXpert389MTBwithPatient.testResults.push(testResult);
  return resultGeneXpert389MTBwithPatient;
}
module.exports = function (analyzerOutput) {
  let resultGeneXpert389MTB = [];
  let patients = analyzerOutput;
  let template = GeneXpert389MTBConfig;
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
        resultGeneXpert389MTB.push(resultObj);
      }
    }
  });
  return resultGeneXpert389MTB;
};