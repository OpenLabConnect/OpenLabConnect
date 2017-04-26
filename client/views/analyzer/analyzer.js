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
  });
