'use strict';
var fs = require('fs');
var path = require('path');
var multer  = require('multer');
var DateFormat = require('dateformat');

exports.upString =  function(req, res) {
  var uploadedFile = path.join(req.directory, req.filename);
  var content = fs.readFileSync(uploadedFile, 'utf8');

  require('../../../string-parser/parser.js')(req.body.name, content)
  .then(function (resolve) {
    resolve.map(function() {
      res.status(200).json({ message: 'Save successful results', analyzerResults: resolve.analyzerResults });
    });
  });
};


function getUploader() {
  var date = new Date();
  var formatDate =  DateFormat(date, 'yyyy-mm-dd hh-mm-ss');

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var analyzerName = req.body.name;
      let directoryUpload = './server/api/import-analyzer/uploads/';
      let directory = './server/api/import-analyzer/uploads/' + analyzerName + '/';
      if (fs.existsSync(directoryUpload)){
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory);
        }
      } else {
        fs.mkdirSync(directoryUpload);
        fs.mkdirSync(directory);
       }
      req.directory = directory;
      cb(null, directory);

    },
    filename: function (req, file, cb) {
      let fileName = '[' + formatDate + ']' + (file.originalname).replace(/%20/g, ' ');
      req.extName = path.extname(file.originalname);
      req.filename = fileName;
      cb(null, fileName);
    }
  });

  return multer({ storage: storage }).single('test');
}

exports.uploader = getUploader();
