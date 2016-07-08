'use strict';

var config = require('./config/environment');

module.exports = function (app) {

  // Auth
  app.use('/auth', require('./auth'));

  // API
  app.use('/api/users', require('./api/user'));
  app.use('/api/tests', require('./api/test'));
  app.use('/api/results', require('./api/test-result'));
  app.use('/api/tables', require('./api/table'));
  app.use('/api/analyzers', require('./api/analyzer'));
  app.use('/api/test-results', require('./api/analyzer-result'));
  app.use('/api/test-maps', require('./api/analyzer-test-map'));
  app.use('/api/serial-analyzers', require('./api/serial-analyzer'));
  app.use('/api/network-analyzers', require('./api/network-analyzer'));
  app.use('/api/file-analyzers', require('./api/file-analyzer'));
  app.use('/api/histories', require('./api/history'));
  app.use('/api/import-analyzers/file', require('./api/import-analyzer/file'));
  app.use('/api/test-types', require('./api/test-type'));


  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).end();
    });

  app.route('/*')
    .get(function (req, res) {
      res.sendFile(
        app.get('appPath') + '/index.html',
        { root: config.root }
      );
    });

};
