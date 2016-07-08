'use strict';

angular.module('openAim')
  .config(function ($stateProvider) {
    $stateProvider
      .state('upload', {
        url: '/upload',
        templateUrl: 'views/upload/upload.html',
        controller: 'UploadCtrl',
        controllerAs: 'vm'
      });
	})
	.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          element.bind('change', function(){
             scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
 	}])
	.service('fileUpload', ['Constant', '$http', '$cookieStore', function (Constant, $http) {
		this.uploadFileToUrl = function(file, template, beginDate){
			var fd = new FormData();
			fd.append('excel', file);
      fd.append('template', template);
      fd.append('beginDate', beginDate);
			return $http.post(Constant.serviceURL.UPLOAD, fd, {
        transformRequest: angular.identity,
        headers: {
        	'Content-Type': undefined
      	}
     	});
    };
	}])
  .service('DateTimeUtil', function () {
    this.toUTC = function (dateTime) {
      // Get timeStamp from dateTime
      dateTime = dateTime instanceof Date ? dateTime.getTime() : dateTime;
      // Get the time difference between UTC time and local time, in minutes
      // Convert timezoneOffset from minutes to milisecond
      var timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
      var modifyTime = dateTime - timezoneOffset; // subtract the time difference
      return modifyTime;
    };
  });
