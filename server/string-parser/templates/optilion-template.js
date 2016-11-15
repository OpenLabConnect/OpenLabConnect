/**
 * The parser for Optilion output
 */

'use strict';
const CONST = require('../../file-parser/config').CONST();
const util = require('./util');

function optimizedString (template, analyzerOutput) {
  let resultOptilion = {};
  let data = analyzerOutput.split(template.splitContent);
  let str = data[0].split(template.splitLine);
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].trim();
    if (str[i].includes(template.containtId)) {
      let arrId = str[i].split(template.splitAccNumber);
      resultOptilion.accessionNumber = arrId[1].trim();
      resultOptilion.testResults = [];
    }
    let reg = new RegExp(template.reg);
    if (reg.test(str[i])) {
      let testResult = {};
      // replace EM, CAN to ''
      str[i] = str[i].replace(template.replaceSymbol, '').trim();
      // Replace multiple space by single space
      str[i] = str[i].replace(template.replaceSpaces, ' ');
      let arrResult = str[i].split(' ');
      testResult.testCode = arrResult[0];
      testResult.result = arrResult[1];
      testResult.type = CONST.testType.value;
      resultOptilion.testResults.push(testResult);
    }
  }

  return resultOptilion;
}

module.exports = function (template, analyzerOutput) {
  let resultOptilion = [];
  let arrayOutputs = analyzerOutput.split(util.hexToAscii(template.splitPatient));
  for (let i = 0; i < arrayOutputs.length; i++) {
    if (arrayOutputs[i].includes(template.containtId)) {
      let resultObj = {};
      resultObj = optimizedString(template, arrayOutputs[i]);
      resultObj.analyzerName = template.name;
      resultOptilion.push(resultObj);
    }
  }
  return resultOptilion;
};

