'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm'
      });
  });
