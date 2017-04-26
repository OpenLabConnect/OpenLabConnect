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
  let testArray = [];
  for (let k = 0; k < splitSpace.length; k++) {
  	if (splitSpace[k].length > 6 && splitSpace[k].length < 10) {
  		let testCode = splitSpace[k].substring(0, 2);
  		let result = splitSpace[k].substring(2);
  		testArray.push(testCode);
  		testArray.push(result);
  	} if (splitSpace[k].length < 6 || splitSpace[k].length == 10) {
  		testArray.push(splitSpace[k]);
  	}
  }
  let k = 5;
  if (testArray[3] < 10 && testArray[k] != '00') {
	  k = 3;
  }
  if (testArray.length % 2  == 0) {
	  k = 4;
  }

  for (let i = testArray.length - 1; i >= 0; i--) {
    let testResult = {};
    testResult.testCode = testArray[i-1];
    testResult.result = testArray[i];
    testResult.type = CONST.testType.value;
    resultAU400.testResults.push(testResult);
    if (testArray[i-1].length == 10) {
        resultAU400.accessionNumber = testArray[i-1];
        break;
    }
  
    if (testArray[i-2].length < 10) {
        i = i-1;
    } else if (testArray[i-2].length == 10) {
        resultAU400.accessionNumber = testArray[i-2];
        break;
    }
  
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

