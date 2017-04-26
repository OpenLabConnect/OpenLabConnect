/**
 * The parser for ABX Pentra ES60 output
 */

'use strict';
const CONST = require('../../file-parser/config').CONST();

function optimizedString (template, analyzerOutput) {
  let resultABXPentraES60 = {};
  let str = analyzerOutput.split(template.splitLine);
  resultABXPentraES60.accessionNumber = str[0].substring(str[0].length-10);
  resultABXPentraES60.testResults = [];
  let k = 4;
  while (k < str.length) {
    if (str[k].includes(template.containtId)) {
      let testResult = {};
      // Replace multiple '^' by single '^'
      str[k] = str[k].replace(template.replaceCharNotTestCode, '^');
      let arrTestCode = str[k].split(template.splitTestCode);
      testResult.testCode = arrTestCode[1].trim();
      let arrResult = str[k].split(template.splitTestResult);
      testResult.result = arrResult[3];
      testResult.type = CONST.testType.value;
      resultABXPentraES60.testResults.push(testResult);
    }
      k++;
  }
  return resultABXPentraES60;
}

module.exports = function (template, analyzerOutput) {
  let resultABXPentraES60 = [];
  // Cut string throught termination character
  let arrayOutputs = analyzerOutput.split(template.splitPatient);
  for (let i = 0; i < arrayOutputs.length; i++) {
    if (arrayOutputs[i].includes(template.containtId)) {
      let resultObj = {};
      resultObj = optimizedString(template, arrayOutputs[i]);
      resultObj.analyzerName = template.name;
      resultABXPentraES60.push(resultObj);
    }
  }
  return resultABXPentraES60;
};