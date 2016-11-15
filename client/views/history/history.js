'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('history', {
        url: '/history?latest',
        templateUrl: 'views/history/history.html',
        controller: 'HistoryCtrl',
        controllerAs: 'vm'
      });
  });
