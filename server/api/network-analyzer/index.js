'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./network-analyzer.controller');
var auth = require('../../auth/auth.service');

router.get('/', auth.isAuthenticated(), controller.findAll);
router.get('/:id', auth.isAuthenticated(), controller.findById);
router.put('/:id', auth.isAuthenticated(), controller.updateById);
router.post('/', auth.isAuthenticated(), controller.create);
// Temporarily disable delete function
// router.delete('/:id', auth.isAuthenticated(), controller.deleteById);

module.exports = router;

