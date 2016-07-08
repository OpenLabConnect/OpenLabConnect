'use strict';
exports.CONST = function () {
  // Error Code
  const errorMessage = {
    templatesWasNotFound: { code: '0', description: 'Template has not been implemented.'},
    testMapIsNotFull: { code: '1', description: 'Test Map is not full.'},
    testCodeInvalid: { code: '2', description: 'Test code was not found.'},
    analyzerIsNotActive: { code: '3', description: 'Analyzer is not active.'},
    fileMissingData: { code: '4', description: 'File upload is missing test-name or test-name is incorrect. Please check your file.'},
    testCodeDoesNotExists: { code: '5', description: 'Test Code does not exists. Please choose right file with right template.'},
    sheetNameIncorrect: { code: '6', description: 'Sheet name of file is incorrect. Please check your file.'},
    templateUnderfined: { code: '7', description: 'Template is underfined.' },
    testNotExist: { code: '8', description: 'Test is not exists on database.'},
    analyzerNotExist: { code: '9', description: 'Analyzer is not exists on database.'},
    templateAndFileIsNotMap: { code: '10', description: 'Template and file is not map.'}
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
    { result: '1', brief: 'Positive'},
    { result: '-1', brief: 'Negative'},
    { result: '0', brief: 'Unknown'},
  ];
  // Test Type
  const testType = {
    result: 'result',
    value: 'value'
  };
  // Location Templates
  const locationTemplates = './server/parser/templates/';
  const locationTemplatesAsy = './server/parser/asy-templates/';
  const requireTemplates = './templates/';
  const requireAsyTemplate = './asy-templates/';
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
    }
  ];
  const asy = {
    accessionNumber: 'SAMPLENAME=',
    result: 'CT0=',
    qualitativeValue: 38,
    qualitative: '(Định Tính)',
    quantitative: '(Định Lượng)',
  };

  return {
    tableName: tableName,
    column: column,
    templates: templates,
    locationTemplates: locationTemplates,
    locationTemplatesAsy: locationTemplatesAsy,
    asy: asy,
    requireTemplates: requireTemplates,
    requireAsyTemplate: requireAsyTemplate,
    resultConvert: resultConvert,
    briefHistoryResultConvert: briefHistoryResultConvert,
    testType: testType,
    errorMessage: errorMessage
  };
};
