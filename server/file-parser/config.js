'use strict';
exports.CONST = function () {
  // Error Code
  const errorMessage = {
    templatesWasNotFound: { code: '0', description: 'Template has not been implemented.' },
    testMapIsNotFull: { code: '1', description: 'Test Map is not full.' },
    testCodeInvalid: { code: '2', description: 'Test code was not found.' },
    analyzerIsNotActive: { code: '3', description: 'Analyzer is not active.' },
    fileMissingData: { code: '4', description: 'File upload is missing test-name or test-name is incorrect. Please check your file.' },
    testCodeDoesNotExists: { code: '5', description: 'Test Code does not exists. Please choose right file with right template.' },
    sheetNameIncorrect: { code: '6', description: 'Sheet name of file is incorrect. Please check your file.' },
    templateUnderfined: { code: '7', description: 'Template is underfined.' },
    testNotExist: { code: '8', description: 'Test is not exists on database.' },
    analyzerNotExist: { code: '9', description: 'Analyzer is not exists on database.' },
    templateAndFileIsNotMap: { code: '10', description: 'Template and file is not map.' },
    duplicateTestResult: { code: '11', description: 'Test result is already an existing result. Please delete it before adding a new one.' }
  };
  // Table name
  const tableName = {
    user: 'users',
    test: 'tests',
    testResult: 'test-results',
    analyzer: 'analyzers',
    analyzerTestMap: 'analyzer-test-maps',
    analyzerResult: 'analyzer-results'
  };
  // Column
  const column = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // Convert Result "Âm", "Dương", "Nghi ngờ", "Âm tính", "Dương tính", "Je(-)", "Je(+)"...
  const resultConvert = [
    { key: 'Âm', result: -1 },
    { key: 'Nghi ngờ', result: 0 },
    { key: 'Âm tính', result: -1 },
    { key: 'Dương tính', result: 1 },
    { key: 'Dương', result: 1 },
    { key: 'Je(-)', result: -1 },
    { key: 'Je(+)', result: 1 }
  ];
  const briefHistoryResultConvert = [
    { result: '1', brief: 'Positive' },
    { result: '-1', brief: 'Negative' },
    { result: '0', brief: 'Unknown' }
  ];
  // Test Type
  const testType = {
    result: 'result',
    value: 'value'
  };
  // Location Templates
  const templateLocation = {
    excel: './server/file-parser/excel-templates/',
    asy: './server/file-parser/asy-templates/',
    txt: './server/file-parser/txt-templates/',
    csv: './server/file-parser/csv-templates/'
  };
  const templateRequire = {
    excel: './excel-templates/',
    asy: './asy-templates/',
    txt: './txt-templates/',
    csv: './csv-templates/'
  };
  // Template Analyzers
  const templates = [
    // IgM DEN Template
    {
      fileNamePattern: 'IgM DEN',
      sheetName: 'IgM DEN',
      fileNameJS: 'IgM_Den'
    },
    // IgG DEN Template
    {
      fileNamePattern: 'IgG DEN',
      sheetName: 'IgG DEN',
      fileNameJS: 'IgG_Den'
    },
    // IgM JE Template
    {
      fileNamePattern: 'IgM JE',
      sheetName: 'IgM JE',
      fileNameJS: 'IgM_JE'
    },
    // IgG HTN Template
    {
      fileNamePattern: 'IgG HTN',
      sheetName: 'IgG HTN',
      fileNameJS: 'IgG_HTN'
    },
    // IgM HTN Template
    {
      fileNamePattern: 'IgM HTN',
      sheetName: 'IgM HTN',
      fileNameJS: 'IgM_HTN'
    },
    // NS1 DEN Template
    {
      fileNamePattern: 'NS1 DEN',
      sheetName: 'NS1-DEN',
      fileNameJS: 'NS1_Den'
    },
    // IgG Dai Template
    {
      fileNamePattern: 'IgG Dai',
      sheetName: 'Sheet1',
      fileNameJS: 'IgG_Dai'
    },
    // Asy Template
    {
      fileNamePattern: 'Realtime.PCR',
      fileNameJS: 'asy'
    },
    // Trioplex Template
    {
      fileNamePattern: 'ABI7500.Trioplex',
      fileNameJS: 'ABI7500-trioplex',
      analyzerName: 'ABI7500'
    },
    // GeneXpert Template
    {
      fileNamePattern: 'GeneXpert.389.MTB',
      fileNameJS: 'GeneXpert.389.MTB',
      analyzerName: 'GeneXpert'
    }
  ];

  const analyzerName = 'Excel';

  const asy = {
    accessionNumber: 'SAMPLENAME=',
    result: 'CT0=',
    qualitativeValue: 38,
    qualitative: '(Định Tính)',
    quantitative: '(Định Lượng)',
    analyzerName: 'Eppendorf'
  };
  const ABI7500Trioplex = {
    analyzerName: 'ABI7500',
    containtResult: /^[A-Z]\d+/,
    splitTestResult: /\t/,
    qualitativeValue: 38,
    notTestResult: 'HSC',
    UndeterminedResult: 'Undetermined'
  };
  const GeneXpert389MTB = {
    analyzerName: 'GeneXpert',
    containtResult: /Test Result/i,
    containtAccessionNumber: /Sample ID/i,
    containtAccessionNumber2: /Notes/i,
    containtTestResult: /Test Result/i,
    splitOpticalData: /OPTICAL DATA/i,
    splitPatientData: '\r\n',
    splitRowPatienData: ',',
    testCode: 'GeneXpert.389.MTB',
  };
  const TXTFile = ['ABI7500.Trioplex'];
  const CSVFile = ['GeneXpert.389.MTB'];
  return {
    tableName: tableName,
    column: column,
    templates: templates,
    templateLocation: templateLocation,
    templateRequire: templateRequire,
    asy: asy,
    ABI7500Trioplex: ABI7500Trioplex,
    GeneXpert389MTB: GeneXpert389MTB,
    resultConvert: resultConvert,
    briefHistoryResultConvert: briefHistoryResultConvert,
    testType: testType,
    errorMessage: errorMessage,
    analyzerName: analyzerName,
    TXTFile: TXTFile,
    CSVFile: CSVFile
  };
};
