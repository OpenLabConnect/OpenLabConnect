/**
 * The parser for Sysmex Ca500 output
 */

const CONST = require('../../file-parser/config').CONST();
const util = require('./util');

function optimizedString(template, analyzerOutput) {
  let str = analyzerOutput.split(template.splitLine);
  let resultSysmexCa500 = {};
  for (let i = 0; i < str.length; i++) {
    // Lines contain "O|" which also contain accessionNumber
    if (str[i].includes(template.containtId)) {
      let rowId = str[i].split(template.splitAccNumber);
      resultSysmexCa500.accessionNumber = rowId[2].substring(5);
      resultSysmexCa500.testResults = [];
    }
    else {
      // Lines contain "R|" which also contain test result
        if (str[i].includes(template.contentWord)) {
          // Replace multiple '^' by single '^'
          str[i] = str[i].replace(template.replaceSymbol, '^');
          let rowResult = str[i].split(util.hexToAscii(02));
          for (let j = 1; j < rowResult.length; j++) {
            if (rowResult[j].includes(template.splitTestCode)) {
              let testResult = {};
              let arrTestCode = rowResult[j].split(template.splitTestCode);
              testResult.testCode = arrTestCode[2].trim();
              let arrResult = rowResult[j].split(template.splitTestResult);
              testResult.result = arrResult[3].trim();
              testResult.type = CONST.testType.value;
              resultSysmexCa500.testResults.push(testResult);
            }
          }
      }
    }
  }
  return resultSysmexCa500;
}

module.exports = function (template, analyzerOutput) {
  let resultSysmexCa500 = [];
  // Cut string throught termination character
  let arrayOutputs = analyzerOutput.split(template.splitPatient);
  for (let i = 0; i < arrayOutputs.length; i++) {
    if (arrayOutputs[i].includes(template.containtId)) {
      let resultObj = {};
      resultObj = optimizedString(template, arrayOutputs[i]);
      resultObj.analyzerName = template.name;
      resultSysmexCa500.push(resultObj);
    }
  }
  return resultSysmexCa500;
};
