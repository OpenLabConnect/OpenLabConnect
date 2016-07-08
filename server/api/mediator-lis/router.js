'use strict';
var utils = require('openhim-mediator-utils');

exports.routerMediator = function (data, apiConfig) {
  // used to bypass self signed certificates
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  var needle = require('needle');
  var apiURL = apiConfig.router.apiURL;
  return new Promise (function(resolve, reject) {
    utils.authenticate(apiConfig, function (err) {
      if (err) {
        return reject({
          success: false,
          error: err
        });
      }
      var options = {
        json: true,
        headers: utils.genAuthHeaders(apiConfig)
      };
      needle.post(apiURL + '/elis-test-results', data, options, function (err, resp) {
      // print error if exist
        if (err) {
          return reject('CAN_NOT_CONNECT_TO_MEDIATOR');
        }
        // check the response status from the API server
        if (resp.statusCode === 200) {
          // successfully routed
          console.log('Mediator has been successfully routed.');
          // Return connect openELIS error
          if (resp.body.openLISError) {
            return reject(resp.body.error);
          }
          resolve({
            success: resp.body['exporting-data'],
            error: resp.body.error,
            transferResults: resp.body.transferResults,
            transferCount: resp.body.transferCount,
            accessionNumber: resp.body.accessionNumber,
            testId: resp.body.testId
          });
        } else {
          console.log('An error occured while trying to routed the mediator: ' + resp.statusCode);
          reject('CAN_NOT_CONNECT_TO_MEDIATOR');
        }
      });
    });
  });

};
