'use strict';

module.exports = {
  'AU400': {
    name: 'AU400',
    splitPatient: '03',
    reg: '[0-9]',
    replaceSpaces: /  +/g,
    replaceChars: /[a-z|A-Z]/g,
    fileNameParser: './templates/au400-template'
  },

  'ABXPentraES60': {
    name: 'ABXPentraES60',
    splitPatient: 'P|',
    containtId: 'R|',
    splitLine: /\r/g,
    splitTestCode: '^',
    splitTestResult: '|',
    replaceCharNotAcc: /[0-9]|\|/g,
    replaceCharNotTestCode: /\^+/,
    fileNameParser: './templates/abxpentra-es60-template'
  },

  'OPTILION': {
    name: 'OPTILION',
    splitPatient: '03',
    containtId: 'Pat. ID',
    splitAccNumber: ':',
    splitContent: 'ENTERED PARAMETERS',
    reg: '^[Na+|K+|Cl-|iCa|pH|nCa]',
    splitLine: /\r/g,
    replaceSymbol: /[\u0018\u0019]/, //EM, CAN
    replaceSpaces: /  +/g,
    fileNameParser: './templates/optilion-template'
  },

  'ProlyteDiaMond': {
    name: 'ProlyteDiaMond',
    splitPatient: /\r\r/g,
    splitLine: /\r/g,
    reg: '^[a-zA-z]',
    containtId: 'ID',
    startWiths: 'Na',
    replaceSpaces: /  +/g,
    fileNameParser: './templates/prolytediamond-template'
  },

  'SysmexCa500': {
    name: 'SysmexCa500',
    splitPatient: 'L|1|N',
    splitLine: /\r/g,
    containtId: 'O|1|',
    splitAccNumber: '^',
    contentWord: 'R|',
    splitTestCode: '^',
    splitTestResult: '|',
    replaceSymbol: /\^+/,
    fileNameParser: './templates/sysmex-ca500-template'
  },

  'CompilyzerHuman': {
    name: 'CompilyzerHuman',
    splitPatient: '03',
    splitLine: /\r/g,
    containtId: 'ID',
    splitAccNumber: ':',
    contentWord1: 'A:C',
    contentWord2: 'UBG',
    replaceSpaces: /  +/g,
    replaceCharNotAcc: /[*]/,
    replaceCharNotResult: /[0-9]|\./g,
    reg: /UBG|BIL|KET|CRE|BLD|PRO|ALB|NIT|LEU|GLU|SG|pH|VC|A:C|RT/,
    fileNameParser: './templates/compilyzer-human-template'
  },
  'Phoenix100': {
    name: 'Phoenix100',
    splitPatient: 'L|1|N',
    splitLine: /R\|\d+\|/,
    replaceSymbol: /[\u0002,\u0017]/g,
    containtId: /O\|\d+\|/,
    splitAccNumber: /[\r\n,\n,\r]/g,
    matchSymbolHat: /\^/,
    matchSymbolHatStr: '\\^',
    matchSectionTestID: /\^{3}ID\^/,
    matchInstComplete: /\|INST_COMPLETE\^/,
    matchAstMic: /\^{3}AST_MIC\^/,
    matchAstMicStr: '\\^{3}AST_MIC\\^',
    matchEndTestResult: /\|{4}/,
    splitTestResult: /\^{2}/,
    matchEnterLine: /[\r\n,\n,\r]/g,
    matchNumber: /\d+/,
    fileNameParser: './templates/phoenix100'
  },
  'Sysmex-KX21': {
    name: 'Sysmex-KX21',
    hopitalCode: '45',
    lengthAccNumber: 6,
    defaultLengthAccNumber: 10,
    containtId: /D\d+U/,
    startAccNumber: /D\d+U\d{6}/,
    endAccNumber: /\d{6}S/,
    endTestResults: '03',
    lstTestResults: /.{5}/g,
    patients: '02',
    fileNameParser: './templates/sysmexKX21',
    default03BeforePoint: '---.-',
    default02BeforePoint: '--.--',
    default01BeforePoint: '-.---',
    default00BeforePoint: '-----',
    WBCResult: {
      testCode: 'WBC',
      format: 'x10^9/L'
    },
    RBCResult: {
      testCode: 'RBC',
      format: 'x10^12/L'
    },
    HGBResult: {
      testCode: 'HGB',
      format: 'g/L'
    },
    HCTResult: {
      testCode: 'HCT',
      format: 'L/L'
    },
    MCVResult: {
      testCode: 'MCV',
      format: 'fL'
    },
    MCHResult: {
      testCode: 'MCH',
      format: 'Pg'
    },
    MCHCResult: {
      testCode: 'MCHC',
      format: 'g/L'
    },
    PLTResult: {
      testCode: 'PLT',
      format: 'x10^9/L'
    },
    LYMperResult: {
      testCode: 'LYM%',
      format: ''
    },
    MXDperResult: {
      testCode: 'MXD%',
      format: ''
    },
    NEUTperResult: {
      testCode: 'NEUT%',
      format: ''
    },
    LYMResult: {
      testCode: 'LYM#',
      format: 'x10^9/L'
    },
    MXDResult: {
      testCode: 'MXD#',
      format: 'x10^9/L'
    },
    NEUTResult: {
      testCode: 'NEUT#',
      format: 'x10^9/L'
    },
    RDWResult: {
      testCode: 'RDW',
      format: 'fL'
    },
    PDWResult: {
      testCode: 'PDW',
      format: 'fL'
    },
    MPVResult: {
      testCode: 'MPV',
      format: 'fL'
    },
    PLCRResult: {
      testCode: 'P-LCR',
      format: ''
    }
  }
};