'use strict';
let Template = require('./template');

 module.exports = function templateNS1Den (workSheet, template) {
  Template.apply(this, arguments);
  // Override variable
  this.templateConfig = {
    testCodeCell: { c: 1, r: 2 },
    // Address of Cut-off: G8
    cutOffCell: { c: 6, r: 8 },
    // TestResultsArea
    resultArea: {
      rowStart: 11,
      colOrder: 0,
      colAccessNumber: 4,
      colResult: 8,
      colOD: 5
    }
  };
 };
