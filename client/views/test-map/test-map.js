'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('test-map', {
        url: '/test-map',
        templateUrl: 'views/test-map/test-map.html',
        controller: 'TestMapCtrl',
        controllerAs: 'vm'
      });
  });