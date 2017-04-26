'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('latest-test', {
        url: '/latest-test',
        templateUrl: 'views/latest-test/latest-test.html',
        controller: 'LatestTestCtrl',
        controllerAs: 'vm'
      });
  });
