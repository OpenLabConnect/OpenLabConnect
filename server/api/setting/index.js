'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./setting.controller');
var auth = require('../../auth/auth.service');

router.get('/:key', auth.isAuthenticated(), controller.findByKey);
router.put('/:key', auth.isAuthenticated(), controller.updateByKey);

module.exports = router;