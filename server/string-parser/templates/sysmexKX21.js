'use strict';

/**
 * The parser for SysmexKX21 output
 */

const CONST = require('../../file-parser/config').CONST();
const util = require('./util');
var lstAccessionNum = [];

function optimizedString(template, patientData) {
  let resultSysmexKX21withPatient = {
    accessionNumber: '',
    testResults: []
  };
  // Accession number
  let accessionNumber = '';
  let startAccessionNum = patientData.match(template.startAccNumber)[0].length;
  let matchAccessionNum = patientData.match(template.endAccNumber);
  let endAccessionNum = matchAccessionNum.index;
  accessionNumber = patientData.substring(startAccessionNum, endAccessionNum);
  accessionNumber = parseInt(accessionNumber).toString();
  // Modify accession number
  let hopitalCode = template.hopitalCode;
  let today = new Date(); // Get current year with format YY
  let currentYY = today.getFullYear().toString().substr(2, 2);
  if (accessionNumber.length < template.defaultLengthAccNumber) {
    let missNumber = template.lengthAccNumber - accessionNumber.length;
    let numZero = '';
    for (let i = 0; i < missNumber; i++) {
      numZero += '0';
    }
    accessionNumber = currentYY + hopitalCode + numZero + accessionNumber;
  }
  resultSysmexKX21withPatient.accessionNumber = accessionNumber;
  // Checking exist accession number
  if (lstAccessionNum.indexOf(accessionNumber) !== 1) {
    lstAccessionNum.push(resultSysmexKX21withPatient.accessionNumber);
    // Test results
    let startTestResults = endAccessionNum + matchAccessionNum[0].length;
    let endTestResults = patientData.match(util.hexToAscii(template.endTestResults)).index;
    let strTestResults = patientData.substring(startTestResults, endTestResults);
    let lstTestResults = strTestResults.match(template.lstTestResults);
    let mainTestResults = [];
    // WBC result
    let resultWBC = lstTestResults[0];
    if (parseFloat(resultWBC) > 0) {
      resultWBC = parseFloat(resultWBC) / 100;
    } else {
      resultWBC = template.default03BeforePoint;
    }
    let WBC_result = {
      testCode: template.WBCResult.testCode,
      result: resultWBC.toString(),
      type: CONST.testType.value
    };
    // RBC result
    let resultRBC = lstTestResults[1];
    if (parseFloat(resultRBC) > 0) {
      resultRBC = parseFloat(resultRBC) / 1000;
    } else {
      resultRBC = template.default02BeforePoint;
    }
    let RBC_result = {
      testCode: template.RBCResult.testCode,
      result: resultRBC.toString(),
      type: CONST.testType.value
    };
    // HGB result
    let resultHGB = lstTestResults[2];
    if (parseInt(resultHGB) > 0) {
      resultHGB = parseInt(parseInt(resultHGB) / 10);
    } else {
      resultHGB = template.default00BeforePoint;
    }
    let HGB_result = {
      testCode: template.HGBResult.testCode,
      result: resultHGB.toString(),
      type: CONST.testType.value
    };
    // HCT result
    let resultHCT = lstTestResults[3];
    if (parseFloat(resultHCT) > 0) {
      resultHCT = parseFloat(resultHCT) / 10000;
    } else {
      resultHCT = template.default01BeforePoint;
    }
    let HCT_result = {
      testCode: template.HCTResult.testCode,
      result: resultHCT.toString(),
      type: CONST.testType.value
    };
    // MCV result
    let resultMCV = lstTestResults[4];
    if (parseFloat(resultMCV) > 0) {
      resultMCV = parseFloat(resultMCV) / 100;
    } else {
      resultMCV = template.default03BeforePoint;
    }
    let MCV_result = {
      testCode: template.MCVResult.testCode,
      result: resultMCV.toString(),
      type: CONST.testType.value
    };
    // MCH result
    let resultMCH = lstTestResults[5];
    if (parseFloat(resultMCH) > 0) {
      resultMCH = parseFloat(resultMCH) / 100;
    } else {
      resultMCH = template.default03BeforePoint;
    }
    let MCH_result = {
      testCode: template.MCHResult.testCode,
      result: resultMCH.toString(),
      type: CONST.testType.value
    };
    // MCHC result
    let resultMCHC = lstTestResults[6];
    if (parseInt(resultMCHC) > 0) {
      resultMCHC = parseInt(parseInt(resultMCHC) / 10);
    } else {
      resultMCHC = template.default00BeforePoint;
    }
    let MCHC_result = {
      testCode: template.MCHCResult.testCode,
      result: resultMCHC.toString(),
      type: CONST.testType.value
    };
    // PLT result
    let resultPLT = lstTestResults[7];
    if (parseInt(resultPLT) > 0) {
      resultPLT = parseInt(parseInt(resultPLT) / 10);
    } else {
      resultPLT = template.default00BeforePoint;
    }
    let PLT_result = {
      testCode: template.PLTResult.testCode,
      result: resultPLT.toString(),
      type: CONST.testType.value
    };
    // LYM% result
    let LYMper = lstTestResults[8];
    if (parseFloat(LYMper) > 0) {
      LYMper = parseFloat(LYMper) / 100;
    } else {
      LYMper = template.default01BeforePoint;
    }
    let LYMper_result = {
      testCode: template.LYMperResult.testCode,
      result: LYMper,
      type: CONST.testType.value
    };
    // MXD% result
    let MXDper = lstTestResults[9];
    if (parseFloat(MXDper) > 0) {
      MXDper = parseFloat(MXDper) / 100;
    } else {
      MXDper = template.default01BeforePoint;
    }
    let MXDper_result = {
      testCode: template.MXDperResult.testCode,
      result: MXDper,
      type: CONST.testType.value
    };
    // NEUT% result
    let NEUTper = lstTestResults[10];
    if (parseFloat(NEUTper) > 0) {
      NEUTper = parseFloat(NEUTper) / 100;
    } else {
      NEUTper = template.default01BeforePoint;
    }
    let NEUTper_result = {
      testCode: template.NEUTperResult.testCode,
      result: NEUTper,
      type: CONST.testType.value
    };
    // LYM result
    let LYM = lstTestResults[11];
    if (parseFloat(LYM) > 0) {
      LYM = parseFloat(LYM) / 100;
    } else {
      LYM = template.default03BeforePoint;
    }
    let LYM_result = {
      testCode: template.LYMResult.testCode,
      result: LYM.toString(),
      type: CONST.testType.value
    };
    // MXD result
    let MXD = lstTestResults[12];
    if (parseFloat(MXD) > 0) {
      MXD = parseFloat(MXD) / 100;
    } else {
      MXD = template.default03BeforePoint;
    }
    let MXD_result = {
      testCode: template.MXDResult.testCode,
      result: MXD.toString(),
      type: CONST.testType.value
    };
    // NEUT result
    let NEUT = lstTestResults[13];
    if (parseFloat(NEUT) > 0) {
      NEUT = parseFloat(NEUT) / 100;
    } else {
      NEUT = template.default03BeforePoint;
    }
    let NEUT_result = {
      testCode: template.NEUTResult.testCode,
      result: NEUT.toString(),
      type: CONST.testType.value
    };
    // RDW result
    let RDW = lstTestResults[14];
    if (parseFloat(RDW) > 0) {
      RDW = parseFloat(RDW) / 100;
    } else {
      RDW = template.default03BeforePoint;
    }
    let RDW_result = {
      testCode: template.RDWResult.testCode,
      result: RDW.toString(),
      type: CONST.testType.value
    };
    // PDW result
    let PDW = lstTestResults[15];
    if (parseFloat(PDW) > 0) {
      PDW = parseFloat(PDW) / 100;
    } else {
      PDW = template.default03BeforePoint;
    }
    let PDW_result = {
      testCode: template.PDWResult.testCode,
      result: PDW.toString(),
      type: CONST.testType.value
    };
    // MPV result
    let MPV = lstTestResults[16];
    if (parseFloat(MPV) > 0) {
      MPV = parseFloat(MPV) / 100;
    } else {
      MPV = template.default03BeforePoint;
    }
    let MPV_result = {
      testCode: template.MPVResult.testCode,
      result: MPV.toString(),
      type: CONST.testType.value
    };
    // PLCR result
    let PLCR = lstTestResults[17];
    if (parseFloat(PLCR) > 0) {
      PLCR = parseFloat(PLCR) / 10000;
    }else {
      PLCR = template.default01BeforePoint;
    }
    let PLCR_result = {
      testCode: template.PLCRResult.testCode,
      result: PLCR,
      type: CONST.testType.value
    };
    mainTestResults.push(
      WBC_result, RBC_result,HGB_result,HCT_result,
      MCV_result, MCH_result, MCHC_result, PLT_result, LYMper_result,
      MXDper_result, NEUTper_result, LYM_result, MXD_result, NEUT_result,
      RDW_result, PDW_result, MPV_result, PLCR_result
    );
    mainTestResults.map(function (parserResult) {
      resultSysmexKX21withPatient.testResults.push(parserResult);
    });
  }
  return resultSysmexKX21withPatient;
}
module.exports = function (template, analyzerOutput) {
  let resultSysmexKX21 = [];
  let patients = analyzerOutput.split(util.hexToAscii(template.patients));
  patients.map(function (patient) {
    if (patient.match(template.containtId)) {
      let resultObj = {
        accessionNumber: '',
        testResults: [],
        analyzerName: ''
      };
      resultObj = optimizedString(template, patient);
      if (resultObj.testResults.length > 0) {
        resultObj.analyzerName = template.name;
        resultSysmexKX21.push(resultObj);
      }
    }
  });
  return resultSysmexKX21;
};
