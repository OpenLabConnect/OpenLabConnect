'use strict';

/**
 * Control things.
 */

var gulp        = require('gulp');
var fs          = require('fs');
var _           = require('lodash');
var async       = require('async');
var jshint      = require('gulp-jshint');
var jscs        = require('gulp-jscs');
var jscsStylish = require('gulp-jscs-stylish');
var argv        = require('yargs').argv;

module.exports = function (done) {

  function getConfig (file) {
    return _.merge(
      JSON.parse(fs.readFileSync('./.jshintrc', 'utf-8')),
      JSON.parse(fs.readFileSync(file, 'utf-8'))
    );
  }

  function control (paths, conf) {
    return function (done) {
      if (argv.reporter && argv.reporter != 'html') {
        console.log('Unsupported [%s] reporter', argv.reporter);
        return;
      } else {
        var control = gulp.src(paths)
        .pipe(jshint(conf))
        .pipe(jshint.reporter('jshint-stylish'));
        if (argv.reporter === 'html') {
          control = control.pipe(jshint.reporter('gulp-jshint-html-reporter', {
          filename: __dirname + '/jshint-output.html',
          createMissingFolders : false
          }));
        }
        control.on('finish', function () {
          gulp.src(paths)
            .pipe(jscs())
            .on('error', function () {})
            .pipe(jscsStylish())
            .on('end', done);
        });
      }
    }
  };

  async.series([
    control(['client/**/*.js', '!client/bower_components/**'], getConfig('./client/.jshintrc')),
    control(['server/**/**/*.js'], getConfig('./server/.jshintrc')),
    control(['gulpfile.js', 'tasks/*.js'], getConfig('./server/.jshintrc'))
  ], done);

};
