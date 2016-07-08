'use strict';

var bowerFilesToExclude = require('./tasks/config/bowerFilesToExclude.js');

var file = require('main-bower-files')({
      filter: function (path) {
        for (var i = 0; i < bowerFilesToExclude.length; i++) {
          if (!/\.js$/.test(path) || new RegExp(bowerFilesToExclude[i]).test(path)) { return false; }
        }
        return true;
      }
    }).concat([
      'bower_components/angular-mocks/angular-mocks.js',
      'app.js',
      'views/**/*.js',
      'views/**/*.html',
      'services/**/*.js',
      'directives/**/*.js',
      'directives/**/*.html',
      'util/*.js'
    ]);

module.exports = function (config) {
  config.set({

    basePath: 'client',

    frameworks: ['jasmine'],

    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/',
      moduleName: 'templates'
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-htmlfile-reporter'
    ],

    files: file,

    exclude: [
      'views/**/*.e2e.js',
      'services/socket/socket.service.js'
    ],

    reporters: ['progress', 'html'],
    htmlReporter: {
      outputFile: '../test/report/client.html',

      // Optional
      pageTitle: 'Unit Tests',
      subPageTitle: 'A sample project description',
      useLegacyStyle: true
    },

    port: 9876,

    colors: true,

    // possible values:
    // config.LOG_DISABLE
    // config.LOG_ERROR
    // config.LOG_WARN
    // config.LOG_INFO
    // config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['PhantomJS'],

    singleRun: true
  });
};
