/* ################################## */
/* ##### Mediator Registration  ##### */
/* ################################## */

'use strict';

exports.registerMediator = function(apiConfig, mediatorConfig) {

    var needle = require('needle');
    var crypto = require('crypto');

    // used to bypass self signed certificates
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // define login credentails for authorization
    var username = apiConfig.username;
    var password = apiConfig.password;
    var apiURL = apiConfig.apiURL;

    // authenticate the username
    needle.get(apiURL + '/authenticate/' + username, function(err, resp, body) {

        console.log('Attempting to create/update mediator');

        // print error if exist
        if (err) {
            console.log(err)
            return;
        }

        // if user isnt found - console log response body
        if (resp.statusCode !== 200) {
            console.log(resp.body);
            return;
        }

        // get the mediator Object to POST to the API
        //var mediatorConfig = require("./config/mediator");

        // create passhash
        var shasum = crypto.createHash('sha512');
        shasum.update(body.salt + password);
        var passhash = shasum.digest('hex');

        // create token
        shasum = crypto.createHash('sha512');
        shasum.update(passhash + body.salt + body.ts);
        var token = shasum.digest('hex');

        // define request headers with auth credentails
        var options = {
            json: true,
            headers: {
                'auth-username': username,
                'auth-ts': body.ts,
                'auth-salt': body.salt,
                'auth-token': token
            }
        }

        // POST mediator to API for creation/update
        needle.post(apiURL + '/mediators', mediatorConfig, options, function(err, resp) {

            // print error if exist
            if (err) {
                console.log(err)
                return;
            }

            // check the response status from the API server
            if (resp.statusCode === 201) {
                // successfully created/updated
                console.log('Mediator has been successfully created/updated.');
            } else {
                console.log('An error occured while trying to create/update the mediator: ' + resp.body);
            }

        });

    });

}

/* ################################## */
/* ##### Mediator Registration  ##### */
/* ################################## */
