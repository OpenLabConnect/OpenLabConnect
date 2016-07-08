'use strict';
const fs = require('fs');
const Config = require('./config');


exports.getData = function (fileName, directory, template, templateName) {
  let dataFile, urlTemplateAsy, checkFileExists;
  urlTemplateAsy = Config.CONST().locationTemplatesAsy + template.fileNameJS;
  // Template was not implement
  try {
      checkFileExists = fs.statSync(urlTemplateAsy + '.js').isFile();
    } catch (e) {
      checkFileExists = false;
    }
  if (!checkFileExists) {
    return Promise.resolve({
      success: false,
      data: Config.CONST().errorMessage.templatesWasNotFound
    });
  }
  dataFile = fs.readFileSync(directory + fileName).toString().split('\r\n');
  let asyTemplate = require(Config.CONST().requireAsyTemplate + template.fileNameJS);
  return asyTemplate.getData(dataFile, templateName);
};

