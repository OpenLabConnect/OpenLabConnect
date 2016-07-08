'use strict';
// load modules
var express = require('express');
var _ = require('lodash');
var DateFormat = require('dateformat');

var app = express();

// get config objects
var config = require('./config/config');
var apiConfig = config.api;
var mediatorConfig = require('./config/mediator');
var needle = require('needle');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// include register script
var register = require('./register');
register.registerMediator(apiConfig, mediatorConfig);


/* ######################### */
/* ##### Server Setup  ##### */
/* ######################### */

/* ##### Default Endpoint  ##### */
app.get('/', function(req, res) {
    console.log("hommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

    /* ######################################### */
    /* ##### Create Initial Orchestration  ##### */
    /* ######################################### */

    var response = 'Primary Route Reached';

    // context object to store json objects
    var ctxObject = {};
    ctxObject.primary = response;

    //Capture 'primary' orchestration data
    var orchestrationsResults = [];
    orchestrationsResults.push({
        name: 'Primary Route',
        request: {
            path: req.path,
            headers: req.headers,
            querystring: req.originalUrl.replace(req.path, ""),
            body: req.body,
            method: req.method,
            timestamp: new Date().getTime()
        },
        response: {
            status: 200,
            body: response,
            timestamp: new Date().getTime()
        }
    });

    /* ###################################### */
    /* ##### Construct Response Object  ##### */
    /* ###################################### */

    var urn = mediatorConfig.urn;
    var status = 'Successful';
    var response = {
        status: 200,
        headers: {
            'content-type': 'application/json'
        },
        body: response,
        timestamp: new Date().getTime()
    };

    // construct property data to be returned
    var properties = {};
    properties['property'] = 'Primary Route';

    // construct returnObject to be returned
    var returnObject = {
        "x-mediator-urn": urn,
        "status": status,
        "response": response,
        "orchestrations": orchestrationsResults,
        "properties": properties
    }

    // set content type header so that OpenHIM knows how to handle the response
    res.set('Content-Type', 'application/json+openhim');
    res.send(returnObject);

});
function dateToUTC(timestamp) {
  let utc = new Date(timestamp).toUTCString();
  // Remove time GMT
  let date = utc.split(' ').slice(0, 4).join(' ');
  return DateFormat(date, 'yyyy-mm-dd');
}
/**
 * Prepare data before exporting into OpenELIS system.
 * @param  {Object} transferResult { mainAnalyzerResult, subAnalyzerResult}
 * @return {Object} transferData {accessNumber, testId, mainResult, subResult}
 */
function prepareData (transferResult) {
  var transferData = {},
    mainResult = transferResult.mainResult.result.result,
    subResult = transferResult.subResult ? transferResult.subResult.result : '',
    beginDate = transferResult.mainResult.beginDate,
    // 2097, 2098, 2292 is a config from LIS
    convertResult = { '-1': '2097', '1': '2098', '0': '2292'};
  transferData.accessNumber = transferResult.mainResult.accessionNumber;
  transferData.testId = transferResult.mainResult.test.testId;
  transferData.beginDate = beginDate ? dateToUTC(beginDate) : '';
  if (!subResult) {
    // transfer result does not have sub result
    transferData.mainResult = convertResult[mainResult] ? convertResult[mainResult] : mainResult;
  } else {
    // transfer result have sub result
    var convertTestResult = '';
    convertTestResult = convertResult[mainResult];
    if (!convertTestResult) { convertTestResult = '2292'; }

    transferData.mainResult = convertTestResult;
    transferData.subResult = subResult.result;
  }
  return transferData;
}
/**
 * Post data into LIS
 * @param  {Object} transferData {accessNumber, testId, mainResult, subResult}
 * @return Response from OpenELIS
 */
function exportingResult (transferData) {
  var options = {
    json: true,
    'Content-Type': 'application/json',
    proxy: process.env.proxy
  };
  return new Promise(function (res, rej) {
    // Using needle to invoke addResult-API from OpenELIS
    needle.post(apiConfig.addResultELIS, transferData, options, function(error, response) {
      if (error) {
        rej('CAN_NOT_CONNECT_TO_OPENELIS'); }
      else if (response) {
        res(response); }
    });
  });
}

app.post('/api/test', function(req, res) {
  var transferResults = req.body;
  var transferData = {};
  transferData = prepareData(transferResults);
  exportingResult(transferData).then(function (response) {
    if (response.statusCode === 500) {
      console.log('Exporting data failed! Error: Internal OpenELIS server error.');
      return res.send({
        'exporting-data': 'fail',
        error: 'Internal OpenELIS server error',
        transferResults: transferResults,
        transferCount: _.size(transferResults),
      });
    }
    if (response.body.message === 'success') {
        console.log('Exporting data successful!');
    } else if (response.body.message === 'fail') {
      // Add result into OpenELIS failure
      console.log('Exporting data failed! Error: ' + response.body.error);
    }
    // Return information to OpenAIM system
    res.send({
      'exporting-data': response.body.message,
      error: response.body.error,
      transferResults: transferResults,
      transferCount: _.size(transferResults)
    });
  }, function (err) {
    res.send({
      openLISError: true,
      error: err
    });
  });
});

// export app for use in grunt-express module
module.exports = app;

/* ######################### */
/* ##### Server Setup  ##### */
/* ######################### */
