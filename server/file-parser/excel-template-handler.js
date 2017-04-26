'use strict';

const fs = require('fs');
const AnalyzerModel = require('../api/analyzer/analyzer.model');
const Config = require('./config');

exports.getData = function (workSheet, template) {
  let testMaps, testResults, urlTemplate, checkFileExists;
  urlTemplate = Config.CONST().templateLocation.excel + template.fileNameJS;
  // Template was not implement
  try {
    checkFileExists = fs.statSync(urlTemplate + '.js').isFile();
  } catch (e) {
    checkFileExists = false;
  }
  if (!checkFileExists) {
    return Promise.resolve({
      success: false,
      data: Config.CONST().errorMessage.templatesWasNotFound
    });
  }

  let Template = require(Config.CONST().templateRequire.excel + template.fileNameJS);
  let templateObj = new Template(workSheet, template);
  // Get test results
  testResults = templateObj.getTestResults(template);
  if (!testResults) {
    return Promise.reject(Config.CONST().errorMessage.sheetNameIncorrect);
  }

  // Get test map
  return templateObj.getTestMaps().then(function(testMaps) {
    // Test-Maps are null
    if (testMaps === Config.CONST().errorMessage.testCodeInvalid.code) {
      return Promise.reject(Config.CONST().errorMessage.testCodeInvalid);
    }
    // Test-Maps are not full
    if (testMaps === Config.CONST().errorMessage.testMapIsNotFull.code) {
      return Promise.reject(Config.CONST().errorMessage.testMapIsNotFull);
    }
    // Test-code does not exists
    if (testMaps === Config.CONST().errorMessage.testCodeDoesNotExists.code) {
      return Promise.reject(Config.CONST().errorMessage.testCodeDoesNotExists);
    }
    // Check Analyzer is actived
    return AnalyzerModel.findById(testMaps[0].analyzer).exec()
      .then(function (analyzer) {
        if (analyzer.actived === false) {
          return Promise.reject(Config.CONST().errorMessage.analyzerIsNotActive);
        }
        // Test-Maps are ok.
        return {
          testMaps: testMaps,
          testResults: testResults
        };
      });
  });
};
