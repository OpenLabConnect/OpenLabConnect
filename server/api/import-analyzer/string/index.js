'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./import-string.controller');
var auth = require('../../../auth/auth.service');

router.post('/', auth.isAuthenticated(), controller.uploader, controller.upString);

module.exports = router;

