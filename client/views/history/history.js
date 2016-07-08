'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('history', {
        url: '/history',
        templateUrl: 'views/history/history.html',
        controller: 'HistoryCtrl',
        controllerAs: 'vm'
      });
  })

  .factory('historyRes', ['$resource', 'Constant', function($resource, Constant) {
    return $resource(Constant.serviceURL.HISTORY, {},
    {
      'update': { method:'PUT' },
      'load': { method: 'GET' }
    });
  }]);
