'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('assign-staff', {
        url: '/assign-staff',
        templateUrl: 'views/assign-staff/assign-staff.html',
        controller: 'assignStaffCtrl',
        controllerAs: 'vm'
      });
  });