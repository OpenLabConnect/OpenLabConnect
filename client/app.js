'use strict';

angular.module('openAim', [
  'ngRoute',
  'ui.router',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'pascalprecht.translate',
  'ui.bootstrap',
  'xeditable',
  'ui.select',
  'btford.socket-io'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/', '/analyzer');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  .factory('authInterceptor',
  function ($rootScope, $q, $cookieStore, $location) {
    return {

      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      responseError: function (response) {
        if (response.status === 401) {
          $rootScope.Auth.logout();
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

    };
  })

  .run(function ($rootScope, $location, Auth, $state, $translate) {

    $rootScope.Auth = Auth;
    $translate.use('vn');

    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isReadyLogged().catch(function () {
        if (next.authenticate) {
          $location.path('/');
        } else if (next.name !== 'login') {
          $state.go('login');
        }
      });
    });

  });
