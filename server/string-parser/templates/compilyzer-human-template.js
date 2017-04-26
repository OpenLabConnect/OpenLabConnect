'use strict';

/**
 * The parser for Compilyzer Human output
 */

const CONST = require('../../file-parser/config').CONST();
const util = require('./util');

function optimizedString(template, analyzerOutput) {
  let line = analyzerOutput.split(template.splitLine);
  let resultCompilyzerHuman = {};
  let reg = new RegExp(template.reg);
  for (let i = 0; i < line.length; i++) {
    if (line [i].includes(template.containtId)) {
      let arrId = line[i].split(template.splitAccNumber);
      resultCompilyzerHuman.accessionNumber = arrId[1];
      resultCompilyzerHuman.testResults = [];
    }
    if (reg.test(line[i])) {
      let testResult = {};
      // Replace multiple space by single space
      line[i] = line[i].replace(template.replaceSpaces, ' ').trim();
      let arrResult = line[i].split(' ');
      // Replace '*' by ''
      arrResult[0] = arrResult[0].replace(template.replaceCharNotAcc, '');

      if (arrResult.length > 3) {
        testResult.testCode = arrResult[0];
        testResult.result = arrResult[1] + " (" + arrResult[2] + ")";
        testResult.type = CONST.testType.value;
        resultCompilyzerHuman.testResults.push(testResult);
      } else {
	    if (arrResult[0].includes(template.contentWord2) && arrResult[1].length > 6) {
          testResult.testCode = arrResult[0];
          testResult.result = arrResult[1].substring(0,6) + ' (' + arrResult[1].substring(6,arrResult[1].length) + ')';
          testResult.type = CONST.testType.value;
          resultCompilyzerHuman.testResults.push(testResult);
        } else {
        testResult.testCode = arrResult[0];
        testResult.result = arrResult[1];
        testResult.type = CONST.testType.value;
        resultCompilyzerHuman.testResults.push(testResult);
		  }
	  }
	}
  }
  return resultCompilyzerHuman;
}

module.exports = function (template, analyzerOutput) {
  let resultCompilyzerHuman = [];
  let arrayOutputs = analyzerOutput.split(util.hexToAscii(template.splitPatient));
  for (let i = 0; i < arrayOutputs.length; i++) {
    if (arrayOutputs[i].includes(template.containtId)) {

      let resultObj = {};
      resultObj = optimizedString(template, arrayOutputs[i]);
      resultObj.analyzerName = template.name;
      resultCompilyzerHuman.push(resultObj);
    }
  }
  return resultCompilyzerHuman;
};
