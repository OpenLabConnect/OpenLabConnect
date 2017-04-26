/**
 * The parser for Prolyte Diamond output
 */

'use strict';
const CONST = require('../../file-parser/config').CONST();
function optimizedString(template, analyzerOutput) {
  console.log('output',analyzerOutput);
  let resultProlyteDiaMond = {};
  let str = analyzerOutput.split(template.splitLine);
  let reg = new RegExp(template.reg);
  console.log('str',str.length);
  for (let i = 0; i < str.length; i++) {
  //console.log('str[i]',str[i]);
  str[i] = str[i].trim();
    if (str[i].includes(template.containtId)) {
	
      resultProlyteDiaMond.accessionNumber = str[i].substring(3).trim();
      resultProlyteDiaMond.testResults = [];
    }

    if (str[i].startsWith(template.startWiths)) {
      // Replace multiple space by single space
	  
	  while (str[i].indexOf('  ') > -1) {
		str[i] = str[i].replace('  ', ' ');
	  }
      
	  
      let arrResult = str[i].split(" ");
	    console.log('arrResult',arrResult);
      if (!reg.test(arrResult[1])) {
        let k = 0;
        while (k < arrResult.length) {
          let testResult= {};
          testResult.testCode = arrResult[k];
          testResult.result = arrResult[++k];
          testResult.type = CONST.testType.value;
          resultProlyteDiaMond.testResults.push(testResult);
          k++;
        }
      }
    }
  }
    return resultProlyteDiaMond;
}

module.exports = function (template ,analyzerOutput) {
  let resultProlyteDiaMond = [];
  let arrayOutputs = analyzerOutput.split(template.splitPatient);
  for (let i = 0; i < arrayOutputs.length; i++) {

    if (arrayOutputs[i].includes(template.containtId)) {
      let resultObj = {};
      resultObj = optimizedString(template, arrayOutputs[i].trim());
      resultObj.analyzerName = template.name;
      resultProlyteDiaMond.push(resultObj);
    }
  }
  return resultProlyteDiaMond;
};