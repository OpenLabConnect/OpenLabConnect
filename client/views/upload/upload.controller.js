'use strict';

angular.module('openAim')
  .controller('UploadCtrl', function ($uibModal, fileUpload, DateTimeUtil, $scope, Constant) {

    var vm = this;
    angular.extend(vm, {
      name: 'UploadCtrl',
      templates: [],
      template: null,
      error: null,
      beginDate: new Date().getTime(), // The date when staff start to do tests

      // Datetimepicker define
      dateOptions: {
        formatYear: 'yyyy',
        maxDate: null,
        minDate: null,
        startingDay: 1
      },

      /**
        datetimepicker open
      */
      dtpOpen: function() {
        vm.dtp.opened = true;
      },

      dtp: {
        opened: false
      },
      uploadFile: function () {
        if (!vm.template) {
          $uibModal.open({
            templateUrl: 'failedModal',
            controller: 'ModalUploadController',
            size: 'sm',
            animation: true,
            backdrop: "static",
            resolve: {
              error: {
                data: '-1'
              }
            }
          });
          return true;
        }
        // Using time stamp to store this date.
        // Prepare date time before upload
        var beginDate = DateTimeUtil.toUTC(vm.beginDate);
        return fileUpload.uploadFileToUrl(vm.myFile, vm.template, beginDate)
        .then(function(res){
          $uibModal.open({
            templateUrl: 'alertModal',
            controller: 'ModalUploadController',
            size: 'sm',
            animation: true,
            backdrop: "static",
            resolve: {
              error: res
            }
          });
          angular.element('#formUpload').get(0).reset();
          vm.template = null;
          vm.beginDate = null; // Reset date picker
          return true;
        }, function(res) {
          $uibModal.open({
            templateUrl: 'failedModal',
            controller: 'ModalUploadController',
            size: 'sm',
            animation: true,
            backdrop: "static",
            resolve: {
              error: res
            }
          });
          return false;
        });
      },
      getTemplate: function() {
        vm.templates = Constant.UPLOAD_TEMPLATE;
      }
    });
    vm.getTemplate();
})
.controller('ModalUploadController', function ($scope, $uibModalInstance, error, Constant) {
  $scope.error = Constant.UPLOAD_ERROR[error.data];
  $scope.ok = function () {
     $uibModalInstance.dismiss('cancel');
  };
});