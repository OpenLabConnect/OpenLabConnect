'use strict';
const fs = require('fs');
const Config = require('./config');

exports.getData = function (fileName, directory, template) {
  let dataFile, urlTemplate, checkFileExists;
  urlTemplate = Config.CONST().templateLocation.txt + template.fileNameJS;
  // Template was not implement
  try {
    checkFileExists = fs.statSync(urlTemplate + '.js').isFile();
  } catch (e) {
    checkFileExists = false;
  }
  if (!checkFileExists) {
    return Promise.reject(Config.CONST().errorMessage.templatesWasNotFound);
  }
  dataFile = fs.readFileSync(directory + fileName).toString().split('\r\n');
  let txtTemplate = require(Config.CONST().templateRequire.txt + template.fileNameJS)(dataFile);
  return Promise.resolve(txtTemplate);
};
