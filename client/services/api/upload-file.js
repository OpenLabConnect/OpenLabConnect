'use strict';
angular.module('openAim')
  .factory('UploadFile', function($http, Constant) {
    return function(formdata) {
      return $http.post(Constant.serviceURL.UPLOAD, formdata, {
        headers: {
          'Content-Type': undefined
        }
      });
    };
  });
