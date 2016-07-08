'use strict';

var _ = require('lodash');

var TableModel = require('./table.model');

/**
 * Error handling for responding
 * @param  res
 * @param  err
 * @returns res.status and err
 */
function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Creating new table in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  TableModel.create(req.body, function (err, table) {
    // Error handling
    if (err) { return handleError(res, err); }
    // Return table object which just have created
    res.status(201).json(_.omit(table.toObject(), ['__v']));
  });
};

/**
 * Updating table by ID.
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id }; // Setting table ID with req.params.id
  TableModel.findOneAndUpdate(query, req.body, function (err, test) {
    if (err) { return handleError(res, err); }
    if (!test) { return res.json(401); }
    res.status(200).json(_.omit(test.toObject(), ['__v']));
  });
};

/**
 * Finding table by ID.
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id; // Setting table ID with req.params.id
  TableModel.findById(id, function (err, table) {
    // Error handling
    if (err) { return handleError(res, err); }
    if (!table) { return res.json(401); }
    // Return updated table
    res.status(200).json(_.omit(table.toObject(), ['__v']));
  });
};

/**
 * Finding all table.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  TableModel.find({}, function (err, table) {
    if (err) { return handleError(res, err); }
    if (!table) { return res.json(401); }
    res.status(200).json(table);
  });
};

/**
 * Deleting table by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id }; // Setting table ID with req.params.id
  TableModel.findOneAndRemove(query, function (err, table) {
    if (err) { return handleError(res, err); }
    if (!table) { return res.json(401); }
    // Return deleted table object
    res.status(200).json(_.omit(table.toObject(), ['__v']));
  });
};
