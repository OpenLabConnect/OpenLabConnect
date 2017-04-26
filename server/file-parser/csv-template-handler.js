'use strict';
const fs = require('fs');
const Config = require('./config');

exports.getData = function (fileName, directory, template) {
  let dataFile, urlTemplate, checkFileExists;
  urlTemplate = Config.CONST().templateLocation.csv + template.fileNameJS;
  // Template was not implement
  try {
    checkFileExists = fs.statSync(urlTemplate + '.js').isFile();
  } catch (e) {
    checkFileExists = false;
  }
  if (!checkFileExists) {
    return Promise.reject(Config.CONST().errorMessage.templatesWasNotFound);
  }
  dataFile = fs.readFileSync(directory + fileName).toString().split('RESULT TABLE');
  let csvTemplate = require(Config.CONST().templateRequire.csv + template.fileNameJS)(dataFile);
  return Promise.resolve(csvTemplate);
};
