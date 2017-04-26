'use strict';

angular.module('openAim')
  .config(function($stateProvider) {
    $stateProvider
      .state('test-result', {
        url: '/test-result',
        templateUrl: 'views/test-result/test-result.html',
        controller: 'TestResultCtrl',
        controllerAs: 'vm'
      });
  });

