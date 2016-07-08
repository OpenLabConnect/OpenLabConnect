'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('test-result', {
        url: '/test-result',
        templateUrl: 'views/test-result/test-result.html',
        controller: 'TestResultCtrl',
        controllerAs: 'vm'
      });
  })

  .factory('analyzerResultsRes', ['$resource', 'Constant', function($resource, Constant) {
    return $resource(Constant.serviceURL.ANALYZER_RESULTS, {},
    {
      'update': { method:'PUT' },
      'searchAnalyzers': { method:'GET' }
    });
  }]);
