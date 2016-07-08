'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./analyzer-result.controller');
var auth = require('../../auth/auth.service');

router.get('/', auth.isAuthenticated(), controller.findAll);
router.get('/:id', auth.isAuthenticated(), controller.findById);
router.put('/:id', auth.isAuthenticated(), controller.updateById);
router.put('/', auth.isAuthenticated(), controller.updateByIds);
router.post('/', auth.isAuthenticated(), controller.create);
router.delete('/:id', auth.isAuthenticated(), controller.deleteById);
router.delete('/', auth.isAuthenticated(), controller.deleteByIds);

module.exports = router;

