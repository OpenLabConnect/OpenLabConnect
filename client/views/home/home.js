'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'vm'
      });
  });
