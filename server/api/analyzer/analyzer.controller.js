'use strict';

var _ = require('lodash');

var AnalyzerModel = require('./analyzer.model');
var TableModel = require('../table/table.model');
var HistoryModel = require('../history/history.model');
var AnalyzersConfig = require('./config').CONST();
var analyzersConnecting = [];
var cron = require('node-cron');
// Initial time to update analyzer
var timeToUpdateAnalyzers = '*/' + AnalyzersConfig.time_minutes + ' * * * *'; // Cron-style Scheduling
var error_detail = {
  not_found: 'Not found analyzer'
};
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
 * Tracking log for analyzer
 * @param objHistory
 */
function trackAnalyzer (objHistory) {
  TableModel.findOne({ name: 'analyzers' }, function (err, table) {
    // Error handling when connect to Table Model
    if (err) {
      console.log(err);
    }
    objHistory.table = table._id; // Set 'analyzers' table for history obj
    var history = new HistoryModel(objHistory);
    history.save(function (err) {
      // Error handling when save history obj into DB
      if (err) {
        console.log(err);
      }
    });
  });
}
/**
 * Creating new analyzer in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  AnalyzerModel.create(req.body, function (err, analyzer) {
    // Error handling when connect to Analyzer Model
    if (err) { return handleError(res, err); }
    // Creating new history object of analyzer
    var objHistory = {};
    objHistory.analyzer = analyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Create analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(analyzer);
    objHistory.brief = 'Create new analyzer: ' + analyzer.name;
    // Tracking log when system create new analyzer
    trackAnalyzer(objHistory);
    res.status(201).json(_.omit(analyzer.toObject(), ['__v']));
  });
};

/**
 * Updating analyzer by ID.
 *
 * @param req
 * @param res
 */
exports.updateById = function (req, res) {
  var query = { _id: req.params.id };
  AnalyzerModel.findOneAndUpdate(query, req.body, function (err, analyzer) {
    // Error handling when connect to Analyzer Model
    if (err) {
      return {
        error_code: 1,
        error_detail:  handleError(res, err)
      };
    }
    // Return error_code, error_detail when system not found analyzer
    if (!analyzer) {
      return {
        error_code: 1,
        error_detail: res.json(error_detail.not_found)
      };
    }
    // Update analyzer successful
    var objHistory = {};
    objHistory.analyzer = analyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Update analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(req.body);
    // Seting brief for updating status
    if (analyzer.actived !== req.body.actived) {
      objHistory.brief = 'Updated analyzer: ' + analyzer.name + '\n Changed status from ' + analyzer.actived + ' to ' + req.body.actived;
    }
    // Seting brief for assigning staff
    if (analyzer.performedBy !== req.body.performedBy) {
      if (req.body.performedBy !== '') {
        objHistory.brief = 'Assign ' + analyzer.name + ' to ' + req.body.performedBy;
      } else {
        objHistory.brief = 'Unassign ' + analyzer.name;
      }
    }
    // Tracking log when updaing analyzer status and assign staff.
    if (analyzer.actived !== req.body.actived || analyzer.performedBy !== req.body.performedBy) {
      // Tracking log when system update analyzer
      trackAnalyzer(objHistory);
    }
    // Return error_code = 0 when analyzer was updated
    res.status(200).json(
      {
        error_code: 0
      }
    );
  });
};
/**
 * Updating analyzer by IDs.
 *
 * @param req
 * @param res
 */
exports.updateByIds = function (req, res) {
  var _ids, _values, dataPackage, user = req.user;
  if (req.body.connecting) {
    console.log(req.body.name +" connecting \n");
    analyzersConnecting.push(req.body);
    return res.status(200).json({ error_code: 0 }); 
  }

  if (req.body.name) {
    findByName(req.body.name).then(function (analyzer) {
      _ids = analyzer._id;
      _values = { actived: req.body.properties };
      dataPackage = {
        user: user,
        _ids: _ids,
        _values: _values
      };
      return update(dataPackage);
    }).then(function (){
      // Return error_code = 0 when analyzers were update
      res.status(200).json({ error_code: 0 });
    }).catch(function (error) {
      return {
        error_code: 1,
        error_detail:  handleError(res, error)
      };
    });
  } else {
    // Validation for req.body.ids
    if (!_.isEmpty(req.body.ids) && req.body.ids instanceof Array && req.body.ids.length > 0) {
      _ids = req.body.ids;
    } else {return handleError(res, 'Bad request.!');}
    // Validation for req.body.properties
    if (!_.isEmpty(req.body.properties)) {
      _values = req.body.properties;
    }
    dataPackage = {
      user: user,
      _ids: _ids,
      _values: _values
    };
    update(dataPackage).then(function() {
      // Return error_code = 0 when analyzers were update
      res.status(200).json({ error_code: 0 });
    }).catch(function(err) {
      return {
        error_code: 1,
        error_detail:  handleError(res, err)
      };
    });
  }
};

/**
 * Finding analyzer by ID.
 *
 * @param req
 * @param res
 */
exports.findById = function (req, res) {
  var id = req.params.id;
  // Finding analyzer by ID
  AnalyzerModel.findById(id, function (err, analyzer) {
    if (err) { return handleError(res, err); }
    if (!analyzer) { return res.json(401); }
    res.status(200).json(_.omit(analyzer.toObject(), ['__v']));
  });
};

/**
 * Finding analyzer by name.
 *
 * @param req
 * @param res
 */
function findByName(name, res) {
  // Finding analyzer by name
  return AnalyzerModel.findOne({ name: name }).exec();
}

/**
 * Finding all analyzer.
 *
 * @param req
 * @param res
 */
exports.findAll = function (req, res) {
  // Finding all analyzer
  AnalyzerModel.find({ enabled: true }, function (err, analyzer) {
    if (err) {
      return handleError(res, err);
    }
    if (!analyzer) {
      return res.json(401);
    }
    res.status(200).json(analyzer);
  });
};

/**
 * Deleting analyzer by ID
 *
 * @param req
 * @param res
 */
exports.deleteById = function (req, res) {
  var query = { _id: req.params.id };
  // Finding analyzer by Id and remove it
  AnalyzerModel.findOneAndRemove(query, function (err, analyzer) {
    if (err) {
      return handleError(res, err);
    }
    if (!analyzer) {
      return res.json(401);
    }
    // Tracking log when system delete analyzer
    var objHistory = {};
    objHistory.analyzer = analyzer._id;
    objHistory.user = req.user.email;
    objHistory.action = 'Delete analyzer';
    objHistory.timestamp = new Date();
    objHistory.data = JSON.stringify(analyzer);
    objHistory.brief = 'Deleted analyzer: ' + analyzer.name;
    trackAnalyzer(objHistory);
    // Return deleted analyzer
    res.status(200).json(_.omit(analyzer.toObject(), ['__v']));
  });
};
function logAnalyzerTestMap(req) {
  // Tracking log for updating analyzerTestMap.
  AnalyzerModel.find({ _id: { $in: req._ids } })
  .exec(function (err, analyzer) {
    // Handling error
    if (err) {
      return err;
    }
    _.forEach(analyzer, function (value) {
      var objHistory = {};
      objHistory.analyzer = value._id;
      objHistory.user = req.user.email;
      objHistory.action = 'Update analyzer';
      objHistory.timestamp = new Date();
      objHistory.data = JSON.stringify(value);
      if (value.actived !== req._values.actived) {
        objHistory.brief = 'Updated analyzer: ' + value.name + '\n Changed status from ' + value.actived + ' to ' + req._values.actived;
        trackAnalyzer(objHistory);
      }
    });
  });
}
function update(req) {
  // Tracking log for updating analyzerTestMap.
  logAnalyzerTestMap(req);
  // Updaing list of analyzers (_ids) with _values
  return AnalyzerModel.update({ _id: { $in: req._ids } }, req._values, { multi: true }).exec();
}
/**
 * Update Analyzers function
 */
function updateAnalyzers () {
  let analyzersDisconnect =  _.differenceBy(AnalyzersConfig.analyzer, analyzersConnecting, 'name');
  analyzersDisconnect.forEach(function (analyzerDisconnect) {
    findByName(analyzerDisconnect.name).then(function (analyzer) {
      let dataPackage = {
        user: '',
        _ids: analyzer._id,
        _values: { actived: false }
      };
      return update(dataPackage);
    }).then(function () {
      var res = { error_code: 0, updatedAnalyzer: analyzerDisconnect.name };
      //console.log(res);
    }).catch(function(error) {
      var err = { error_code: 1, error_detail:  error};
      console.log(err);
    });
  });
  if (analyzersConnecting.length > 0) {
    analyzersConnecting.forEach(function (analyzerConnecting) {
      findByName(analyzerConnecting.name).then(function (analyzer) {
        if (analyzer.actived === false) {
          let dataPackage = {
            user: '',
            _ids: analyzer._id,
            _values: { actived: true }
          };
          return update(dataPackage);
        }
      }).then(function () {
        var res = { error_code: 0, updatedAnalyzer: analyzerConnecting.name };
        //console.log(res);
      }).catch(function(error) {
        var err = { error_code: 1, error_detail:  error };
        console.log(err);
      });
    });
  }
  analyzersConnecting = [];
}
// Set status for analyzers
cron.schedule(timeToUpdateAnalyzers, function(){
  updateAnalyzers();
});


