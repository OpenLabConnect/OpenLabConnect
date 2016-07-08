'use strict';

// include router script
var route = require('./router');
exports.importData = function (data, apiConfig) {
    return route.routerMediator(data, apiConfig);
};
