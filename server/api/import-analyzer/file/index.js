'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./import-file.controller');
var auth = require('../../../auth/auth.service');

router.post('/', auth.isAuthenticated(), controller.upload, controller.uploadFile);

module.exports = router;
