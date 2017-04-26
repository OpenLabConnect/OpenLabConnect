'use strict';

var _ = require('lodash');

var SettingModel = require('../setting/setting.model');
var TableModel = require('../table/table.model');
var HistoryModel = require('../history/history.model');

/**
 * Tracking system-config
 * @param objHistory
 */
function trackTestResult (objHistory) {
  TableModel.findOne({ name: 'settings' }, function (err, table) {
    // Error handling
    if (err) { console.log(err); }
    objHistory.table = table._id;
    var history = new HistoryModel(objHistory);
    // Save history object
    history.save(function (err) {
      if (err) { console.log(err); }
    });
  });
}

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
 * Updating system config by ID.
 *
 * @param req
 * @param res
 */
exports.updateByKey = function (req, res) {
  var query = { key: req.params.key }; // Setting system config ID with req.params.id
  SettingModel.findOneAndUpdate(query, req.body, function (err, setting) {
    if (err) { return handleError(res, err); }
    if (!setting) { return res.json(401); }
    // Tracking log for system config.
    var objHistory = {};
    objHistory.user = req.user.email;
    objHistory.action = 'Update setting';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(setting);
    objHistory.brief = 'Updated System Config' +
    					'\nName: ' + setting.key +
    					'\nChange value from: ' + setting.value + ' to ' + req.body.value;
    trackTestResult(objHistory);
    // Return updated system config object
    res.status(200).json(_.omit(setting.toObject(), ['__v']));
  });
};

/**
 * Finding system configs by key
 *
 * @param req
 * @param res
 */
exports.findByKey = function (req, res) {
  var key = req.params.key;
  SettingModel.findOne({ key: key })
  .exec(function (err, setting) {
    if (err) { return handleError(res, err); }
    if (!setting) { return res.json(401); }
    res.status(200).json(setting);
  });
};