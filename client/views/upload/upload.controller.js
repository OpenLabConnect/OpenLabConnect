'use strict';

angular.module('openAim')
  .controller('UploadCtrl', function(DateTimeUtil, Api, UploadFile, Setting, ModalService, $scope, $q, Constant) {

    var vm = this;
    angular.extend(vm, {
      name: 'UploadCtrl',
      templates: [],
      template: null,
      error: null,
      autoInsert: null,
      autoInsertObj: {},
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

      uploadFile: function() {
        if (!vm.template) {
          // -1 is a error code: template is empty
          ModalService.uploadFile(false, '-1');
          return true;
        }

        // Check auto insert config last time before upload file
        Setting.get(Constant.setting.AUTO_INSERT)
          .then(function(autoInsert) {
            if (autoInsert.value !== vm.autoInsertObj.value) {
              ModalService.autoInsertChange(autoInsert).result
              .then(function() {
                vm.handleUpload(autoInsert.value === 'true');
              });
              vm.getAutoInsertConfig();
            } else {
              vm.handleUpload(autoInsert.value === 'true');
            }
          });
      },

      /**
        update status
        @param data
      */
      updateStatus: function(analyzerResults) {
        var ids = [],
          data = {},
          properties = {};
        // collect data, push all records id of current page to ids
        analyzerResults.forEach(function(analyzerResult) {
          ids.push(analyzerResult._id);
        });
        properties = { status: Constant.testResultStatus.SAVED };
        data = {
          ids: ids,
          properties: properties
        };
        // TODO: get data and send to API via the put method
        // return promise
        var deferred = $q.defer();
        Api.AnalyzerResult.update(data).$promise
          .then(function(res) {
//            ModalService.successTransfer(res);
            deferred.resolve();
          })
          .catch(function() {
            ModalService.error(Constant.ECONNREFUSED);
            deferred.reject(Constant.ECONNREFUSED);
          });
        return deferred.promise;
      },

      handleUpload: function(isAutoInsert) {
        // Using time stamp to store this date.
        // Prepare date time before upload
        var beginDate = vm.beginDate ? vm.beginDate : new Date().getTime();
        beginDate = DateTimeUtil.toUTC(beginDate);
        var fd = new FormData(),
         Form = Constant.UPLOAD.FORMDATA;
        fd.append(Form.file, vm.myFile);
        fd.append(Form.template, vm.template);
        var template = vm.template;
        fd.append(Form.beginDate, beginDate);
        return UploadFile(fd)
          .then(function(res) {
            ModalService.uploadFile(true).result.then(function () {
              if (isAutoInsert) {
                if (!Constant.TXTFILE.includes(template) 
                    && !Constant.CSVFILE.includes(template)) {
                  vm.updateStatus(res.data.analyzerResults);
                }
              }
            });
            angular.element('#formUpload').get(0).reset();
            vm.template = null;
            vm.beginDate = new Date().getTime(); // Reset date picker
            return true;
          }, function(res) {
            ModalService.uploadFile(false, res.data);
            return false;
          });
      },

      getTemplate: function() {
        Setting.get(Constant.setting.SUPPORT_TEMPLATES ).then(function (supportTemplates) {
          var lstSupportTemplates = [];
          supportTemplates.valueArray.forEach( function (supportTemplate) {
            if (supportTemplate.isSupport) {
                lstSupportTemplates.push(supportTemplate.name);
              }
          });
          vm.templates = lstSupportTemplates;
        });
      },

      showConfig: function(isAuto) {
        vm.autoInsertObj = isAuto;
        vm.autoInsert = vm.autoInsertObj.value === 'true' ? Constant.setting.ON : Constant.setting.OFF;
      },

      getAutoInsertConfig: function() {
        Setting.get(Constant.setting.AUTO_INSERT ).then(vm.showConfig);
      }

    });
    vm.getTemplate();
    vm.getAutoInsertConfig();
  });
