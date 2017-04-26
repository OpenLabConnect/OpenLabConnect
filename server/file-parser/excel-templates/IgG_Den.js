'use strict';
let Template = require('./template');

 module.exports = function templateIgGDen (workSheet, template) {
  Template.apply(this, arguments);
  // Override variable
  this.templateConfig = {
    testCodeCell: { c: 1, r: 2 },
    cutOffCell: { c: 8, r: 8 },
    resultArea: {
      rowStart: 11,
      colOrder: 0,
      colAccessNumber: 4,
      colResult: 9,
      colOD: 7
    }
  };
 };
