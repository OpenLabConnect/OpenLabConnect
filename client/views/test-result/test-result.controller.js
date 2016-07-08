'use strict';

angular.module('openAim')
  .controller('TestResultCtrl', function ($interval, $http, $uibModal, analyzerRes, analyzerResultsRes, Constant, $q) {

    var vm = this;

    angular.extend(vm, {
      // init data
      name: 'TestResultCtrl',
      analyzers: [],
      analyzerResults : [],
      search: {
        analyzer: null,
        accessionNumber: '',
        beginDate: new Date(),
        status: ''
      },
      timestamp: new Date().getTime(),
      testResultStatus: [Constant.testResultStatus.NEW, Constant.testResultStatus.SAVED],
      selectAll: false,
      autoInsert: false,
      disabledDelBtn: true,
      disabledDeSelectAllBtn: true,
      countCheck: 0,

      // pagination config
      recordPerPage: Constant.record_per_page.TEST_RESULT,
      currentPage: 1,
      totalItems: 0,

      // Datetimepicker define
      dateOptions: {
        formatYear: 'yyyy',
        maxDate: null,
        minDate: null,
        startingDay: 1
      },
      noData: true,

      /**
        datetimepicker open
      */
      dtpOpen: function() {
        vm.dtp.opened = true;
      },

      dtp: {
        opened: false
      },

      /**
        get all analyzers
      */
      getAnalyzers: function(){
        return analyzerRes.query().$promise.then(function(data) {
          console.log(Constant.msg.analyzer.MSG_LOAD_DATA_SUCCESS + new Date());
          vm.analyzers = data;
          return data;
        }, function() {
          console.log(Constant.msg.analyzer.MSG_LOAD_DATA_UNSUCCESS + new Date());
          return false;
        });
      },

      /*
        get analyzer results
        @param: status (NEW/TRANSFERRED)
        by default: the status is NEW and the receivedDate is current date
      */
      getAnalyzerResults: function(status){
        var analyzerID = null;
        if(vm.search.analyzer) {
          analyzerID = vm.search.analyzer._id;
        }
        // send request with filter condition and get return data
        return analyzerResultsRes.searchAnalyzers({
          page: vm.currentPage,
          analyzer: analyzerID,
          status: (status === '') ? null : status,
          beginDate: (vm.timestamp === '') ? null : vm.timestamp,
          accessionNumber: (vm.search.accessionNumber === '') ? null : vm.search.accessionNumber,
          limit: vm.recordPerPage
        }).$promise.then(function(data) {
            console.log(Constant.msg.analyzerResult.MSG_LOAD_DATA_SUCCESS + new Date());
            vm.analyzerResults = data.analyzerResult;
            vm.totalItems = data.totalAnalyzerResult;
            vm.noData = (data.totalAnalyzerResult === 0);
            // config output data
            vm.analyzerResults.forEach(function(analyzerResult) {
              // set all result is unchecked
              analyzerResult.selected = false;
              /*
                define display field: testResultStr
                result type is "result" and result value is '-1': "Negative"
                result type is "result" and result value is '1': "Positive"
                result type is "result" and result value is '0': "Unknow"
              */
              if(analyzerResult.result.type.name === Constant.testResultType.RESULT) {
                switch(analyzerResult.result.result) {
                  case Constant.testResult.POSITIVE:
                    analyzerResult.resultStr = Constant.testResultStr.POSITIVE;
                    break;
                  case Constant.testResult.NEGATIVE:
                    analyzerResult.resultStr = Constant.testResultStr.NEGATIVE;
                    break;
                  case Constant.testResult.UNKNOWN:
                    analyzerResult.resultStr = Constant.testResultStr.UNKNOWN;
                    break;
                  default:
                    analyzerResult.resultStr = analyzerResult.result.result;
                    break;
                }
              } else {
                 analyzerResult.resultStr = analyzerResult.result.result;
              }
            });
            return data;
        }, function() {
          console.log(Constant.msg.analyzerResult.MSG_LOAD_DATA_UNSUCCESS + new Date());
          return false;
        });
      },

      /**
        auto insert all test results to OpenELIS system
      */
      onAutoInsert: function() {
        if(vm.autoInsert) {
          // init data
          var ids = Constant.ALL,
            data = {},
            properties = {};
          properties = { status: Constant.testResultStatus.SAVED };
          data = {
            ids: ids,
            properties: properties
          };
          // call API to send test results to LIS sytem and reload page
          vm.updateStatus(data).then(function() {
            vm.getAnalyzerResults(vm.search.status);
            console.log(Constant.msg.analyzerResult.MSG_UPDATE_DATA_SUCCESS + new Date());
          }, function() {
            console.log(Constant.msg.analyzerResult.MSG_UPDATE_DATA_UNSUCCESS + new Date());
          });
        }
      },

      /**
       * Increase or decrease countCheck when user checks or unchecks record
       * then disable or enable Delete button and Deselect All button
       * @param  {Boolean} isCheck
       */
      check: function (isCheck) {
        vm.selectAll = false;
        if (isCheck) {
          vm.countCheck ++;
        } else {
          vm.countCheck --;
        }
        if (vm.countCheck > 0) {
          vm.disabledDelBtn = false;
          vm.disabledDeSelectAllBtn = false;
        } else {
          vm.disabledDelBtn = true;
          vm.disabledDeSelectAllBtn = true;
        }
      },

      /**
        select all or deselect all analyzer results
      */
      checkAll: function() {
        var checkNumber;
        if (vm.selectAll) {
          checkNumber = 1;
        } else {
          checkNumber = -1;
        }
        vm.analyzerResults.forEach(function(analyzerResult) {
          if (analyzerResult.selected != vm.selectAll) {
          analyzerResult.selected = vm.selectAll;
            vm.countCheck += checkNumber;
          }
        });
        vm.disabledDelBtn = !vm.selectAll;
        vm.disabledDeSelectAllBtn = !vm.selectAll;
      },

      /**
        select all or deselect all
        @param condition (true: select all, false: deselect all)
      */
      onSelectAll: function(condition) {
        vm.selectAll = condition;
        vm.checkAll();
      },

      /**
        update status
        @param data
      */
      updateStatus: function(data) {
        // TODO: get data and send to API via the put method
        // return promise
        var deferred = $q.defer();
        analyzerResultsRes.update(data).$promise
          .then(function(res) {
            $uibModal.open({
              templateUrl: 'alert-success-modal',
              controller: 'AlertSuccessModalTestResultCtrl',
              size: 'sm',
              animation: true,
              resolve: {
                info: function () {
                  return res;
                }
              }
            });
            deferred.resolve();
          })
          .catch(function (err) {
            deferred.reject(err.data);
            var alertErrorModal = $uibModal.open({
              templateUrl: 'alert-error-modal',
              controller: 'AlertErrorModalTestResultCtrl',
              size: 'sm',
              animation: true,
              resolve: {
                accessionNumberLength: function () {
                  return false;
                },
                errorMessage: function () {
                  console.log(err.data);
                  return err.data;
                }
              }
            });
            // open error message modal
            return alertErrorModal.result.then(function() {
              vm.getAnalyzerResults(vm.search.status);
            });
          });
        return deferred.promise;
      },
      updateAccessionNumber: function(data) {
        var deferred = $q.defer();
        analyzerResultsRes.update({ id: data._id }, data).$promise
          .then(function() {
            deferred.resolve();
          })
          .catch(function (err) {
            deferred.reject(err.data);
          });
        return deferred.promise;
      },

      /**
        save the test results of current page into main tables
      */
      onResultEntry: function() {
        // init
        var ids = [],
            data = {},
            properties = {};
        // collect data, push all records id of current page to ids
        vm.analyzerResults.forEach(function(analyzerResult) {
             ids.push(analyzerResult._id);
        });
        properties = { status: Constant.testResultStatus.SAVED };
        data = {
          ids: ids,
          properties: properties
        };
        // call API
        if(data.ids.length>0) {
          vm.updateStatus(data).then(function() {
            vm.getAnalyzerResults(vm.search.status);
            console.log(Constant.msg.analyzerResult.MSG_UPDATE_DATA_SUCCESS + new Date());
          }, function() {
            console.log(Constant.msg.analyzerResult.MSG_UPDATE_DATA_UNSUCCESS + new Date());
          });
        }
      },

      /**
        search test results
      */
      onSearch: function() {
        vm.setPage(1);
        if(vm.search.beginDate === undefined) {
          vm.search.beginDate = null;
        }
        if(vm.search.beginDate) {
          vm.timestamp = vm.search.beginDate.getTime();
        } else {
          vm.timestamp = '';
        }
        vm.getAnalyzerResults(vm.search.status);
      },

      /**
        edit accessionNumber
        @param analyzerResult
      */
      onAccessionNumberSave: function(analyzerResult) {
        var accNumber = analyzerResult.accessionNumber;
        if (!accNumber || accNumber.length < Constant.testResultView.accessionNumberLength ||
         accNumber.length > Constant.testResultView.accessionNumberLength) {
          var alertErrorModal = $uibModal.open({
                templateUrl: 'alert-error-modal',
                controller: 'AlertErrorModalTestResultCtrl',
                size: 'sm',
                animation: true,
                resolve: {
                  accessionNumberLength: function () {
                    return true;
                  },
                  errorMessage: function () {
                    return Constant.testResultError.EDIT_ACCESSIONUMBER;
                  }
                }
            });
            // open error message modal
            return alertErrorModal.result.then(function() {
              vm.getAnalyzerResults(vm.search.status);
            });
        }
        vm.updateAccessionNumber(analyzerResult).then(function() {
          vm.getAnalyzerResults(vm.search.status);
          console.log(Constant.msg.analyzerResult.MSG_UPDATE_DATA_SUCCESS + new Date());
        }, function() {
          console.log(Constant.msg.analyzerResult.MSG_UPDATE_DATA_UNSUCCESS + new Date());
        });
      },

      /**
        set page
        @param pageNo
      */
      setPage: function (pageNo) {
        vm.currentPage = pageNo;
      },

      /**
        change page
      */
      pageChanged: function() {
        vm.onSelectAll(false); // Uncheck the check-box when change page
        vm.getAnalyzerResults(vm.search.status);
      },

      /**
        delete record with confirmation
      */
      onDelete: function() {
        // collect records id to delete
        var ids = [];
        vm.analyzerResults.forEach(function(analyzerResult) {
          if(analyzerResult.selected) {
            ids.push(analyzerResult._id);
          }
        });

        if(ids.length>0) {
          // define delete confirmation modal
          var confirmDelete = $uibModal.open({
            templateUrl: 'confirmDeleteResults',
            controller: 'ConfirmDeleteResultCtrl',
            size: 'sm',
            animation: true,
            backdrop: "static",
            resolve: {
              ids: function() {
                return ids;
              }
            }
          });
          // open delete confirmation modal and delete records
          confirmDelete.result.then(function (ids) {
            $http({
              url: Constant.serviceURL.ANALYZER_RESULTS_MULTI_DELETE,
              method: 'DELETE',
              data: {ids: ids},
              headers: {"Content-Type": "application/json;charset=utf-8"}
            }).then(function() {
              // Uncheck selectAll
              vm.selectAll = false;
              // reload data with current search status
              vm.getAnalyzerResults(vm.search.status);
              console.log(Constant.msg.analyzerResult.MSG_DELETE_DATA_SUCCESS + new Date());
            }, function(){
              console.log(Constant.msg.analyzerResult.MSG_DELETE_DATA_UNSUCCESS + new Date());
            });
          });
        }
      }

    });

    // on page loaded
    vm.search.status = Constant.testResultStatus.NEW;
    vm.getAnalyzerResults(vm.search.status);
    vm.getAnalyzers();
    // set interval, auto insert to LIS every 5 minutes if checkbox is checked and reload data.
    $interval(function() {
      console.log("Run auto load at " + new Date());
      vm.onAutoInsert();
      vm.getAnalyzerResults(vm.search.status);
    }, 300000);
  })

  .controller('ConfirmDeleteResultCtrl', function ($scope, $uibModalInstance, ids) {
    $scope.ok = function () {
      $scope.ids = ids;
      $uibModalInstance.close($scope.ids);
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })
  .controller('AlertErrorModalTestResultCtrl', function ($scope, $uibModalInstance, Constant, accessionNumberLength, errorMessage) {
    if (accessionNumberLength) {
      $scope.translationData = {
        accessionNumberLength: Constant.testResultView.accessionNumberLength
      };
    }
    $scope.errorMessage = errorMessage;
    $scope.close = function () {
      $uibModalInstance.close();
    };
  })
  .controller('AlertSuccessModalTestResultCtrl', function ($scope, $uibModalInstance, info) {
    $scope.translationData = {
      total: info.totalAnalyzerResult,
      success: info.success,
      fail: info.fail
    };
    $scope.info = 'INFO_TRANSFER';
    $scope.total = 'INFO_TOTAL';
    $scope.success = 'INFO_SUCCESS';
    $scope.fail = 'INFO_FAIL';
    $scope.close = function () {
      $uibModalInstance.close();
    };
  });
