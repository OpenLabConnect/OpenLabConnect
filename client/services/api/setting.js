'use strict';
angular.module('openAim')
  .factory('Setting', function($resource, $http, Constant) {
    var api = $resource(Constant.serviceURL.SETTING, {}, {
      'save': { method: 'PUT'}
    });

    return {
      get: function(key) {
        return api.get({key: key}).$promise;
      },
      save: function(key, value) {
        return api.save({key: key}, value).$promise;
      }
    };
  });
