'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('analyzer', {
        url: '/analyzer',
        templateUrl: 'views/analyzer/analyzer.html',
        controller: 'AnalyzerCtrl',
        controllerAs: 'vm'
      });
  })

  .factory('analyzerRes', ['$resource', 'Constant', function($resource, Constant) {
    return $resource(Constant.serviceURL.ANALYZER, {},
    {
      'update': { method:'PUT' }
    });
  }]);
