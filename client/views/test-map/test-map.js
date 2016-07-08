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
  })
	.factory('testMapRes', ['$resource', 'Constant', function($resource, Constant) {
    return $resource(Constant.serviceURL.TEST_MAPS, {},
    {
     'load': { method:'GET' },
     'update': { method: 'PUT' }
    });
	}]);