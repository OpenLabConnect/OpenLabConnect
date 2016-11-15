/**
 * The parser for AU400 output
 */

'use strict';
const CONST = require('../../file-parser/config').CONST();
const util = require('./util');

function optimizedString (template, analyzerOutput) {
  // Replace alphabet character by single space
  let rmSpace = analyzerOutput.replace(template.replaceChars, " ").trim();
  // Replace multiple space by single space
  rmSpace = rmSpace.replace(template.replaceSpaces, ' ');
  let splitSpace = rmSpace.split(' ');
  let resultAU400 = {};
  resultAU400.accessionNumber = splitSpace[3];
  resultAU400.testResults = [];
  let k = 4;
  while (k < splitSpace.length) {
      // Separating the adjacent strings (testId and result)
    let testResult = {};
    if (splitSpace[k].length > 6) {
      testResult.testCode = splitSpace[k].substring(0, 2);
      testResult.result = splitSpace[k].substring(2);
      testResult.type = CONST.testType.value;
    } else {
      testResult.testCode = splitSpace[k];
      testResult.result = splitSpace[++k];
      testResult.type = CONST.testType.value;
    }
    resultAU400.testResults.push(testResult);
    k++;
  }
  return resultAU400;
}

module.exports = function (template, analyzerOutput) {
  let resultAU400 = [];
  let arrayOutputs = analyzerOutput.split(util.hexToAscii(template.splitPatient));
  let reg = new RegExp(template.reg);
  for (let i = 0; i < arrayOutputs.length; i++) {
      if (reg.test(arrayOutputs[i])) {
        let resultObj = {};
        resultObj = optimizedString(template, arrayOutputs[i]);
        resultObj.analyzerName = template.name;
        resultAU400.push(resultObj);
      }
  }

  return resultAU400;
};

