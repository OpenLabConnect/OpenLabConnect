'use strict';

/**
 * Serve app. For dev purpose.
 */

var nodemon    = require('gulp-nodemon');

module.exports = function () {
    return nodemon({
        script: 'mediator/start.js',
        ext: 'js',
        ignore: ['client', 'dist', 'node_modules', 'gulpfile.js']
      });
};
