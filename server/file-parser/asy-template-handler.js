'use strict';
const fs = require('fs');
const Config = require('./config');

exports.getData = function (fileName, directory, template, templateName) {
  let dataFile, urlTemplateAsy, checkFileExists;
  urlTemplateAsy = Config.CONST().templateLocation.asy + template.fileNameJS;
  // Template was not implement
  try {
    checkFileExists = fs.statSync(urlTemplateAsy + '.js').isFile();
  } catch (e) {
    checkFileExists = false;
  }
  if (!checkFileExists) {
    return Promise.reject(Config.CONST().errorMessage.templatesWasNotFound);
  }
  dataFile = fs.readFileSync(directory + fileName).toString().split('\r\n');
  let asyTemplate = require(Config.CONST().templateRequire.asy + template.fileNameJS);
  return asyTemplate.getData(dataFile, templateName);
};
