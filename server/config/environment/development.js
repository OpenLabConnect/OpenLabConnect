'use strict';

var pg = require('pg');
var path = require('path');
var multer  = require('multer');
var date = new Date();
var formatDate = date.getFullYear().toString() +
  '-'	+ (date.getMonth() + 1).toString() +
  '-'	+ date.getDate().toString() +
  ' '	+ date.getHours().toString() +
  '-'	+ date.getMinutes().toString() +
  '-'	+ date.getSeconds().toString();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let directory = './server/config/upload/file/';
    req.directory = directory;
    cb(null, './server/config/upload/file/');
  },
  filename: function (req, file, cb) {
    let fileName = '[' + formatDate + ']' +
      (file.originalname).replace(/%20/g, ' ');
    req.extName = path.extname(file.originalname);
    req.filename = fileName;
    cb(null, fileName);
  }
});

var uploadMulter = multer({ storage: storage }).single('file');

module.exports = {
  mongo: {
    uri: 'mongodb://localhost/openaim-dev'
  },
  upload: uploadMulter,
  postgres: pg,
  clinlimsGetLatestTest: 'postgres://clinlims:clinlims@172.18.39.59:5432/clinlims_deploy_PI',
  loginAPILIS: 'http://localhost:8080/openELIS_vi/services/etor/validateAIMLogin'
};
