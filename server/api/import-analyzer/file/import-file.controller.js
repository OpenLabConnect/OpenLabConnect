'use strict';

var config = require('../../../config/environment');
/**
 * Receiving and storing a documentation.
 *
 * @param req
 * @param res
 */
exports.upload = config.upload;
exports.uploadFile = function (req, res) {
  var beginDate = '';
  if (req.body.beginDate > 0) { // Validation input date
    beginDate = req.body.beginDate;
  }
  require('../../../file-parser/parser.js')(req.filename, req.extName, req.directory, req.body.template, beginDate)
  .then(function (resolve) {
    res.status(200).json({ message: 'File was uploaded', analyzerResults: resolve.analyzerResults });
  },
  function (rej) {
    res.setHeader('error', rej.code);
    res.status(500).end(rej.code);
  });
};
