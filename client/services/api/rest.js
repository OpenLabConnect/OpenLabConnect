'use strict';
angular.module('openAim')
  .factory('Api', function($resource, $http, Constant) {
    var Service = Constant.serviceURL;
    return {
      Analyzer: $resource(Service.ANALYZER, {}, {
        'update': { method: 'PUT' }
      }),

      History: $resource(Service.HISTORY, {}, {
        'update': { method: 'PUT' }
      }),

      Test: $resource(Service.TEST, {}),

      TestMap: $resource(Service.TEST_MAPS, {}, {
        'update': { method: 'PUT' }
      }),

      AnalyzerResult: $resource(Service.ANALYZER_RESULTS, {}, {
        'update': { method: 'PUT' }
      })
    };
  });
