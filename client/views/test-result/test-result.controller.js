'use strict';

angular.module('openAim')
  .controller('TestResultCtrl', function ($http, Api, Setting, ModalService, Constant, $q, $interval, $rootScope) {

    var vm = this;

    angular.extend(vm, {
      // init data
      name: 'TestResultCtrl',
      analyzers: [],
      analyzerResults : [],
      search: {
        analyzer: null,
        accessionNumber: '',
        testType: '',
        beginDate: new Date(),
        status: ''
      },
      timestamp: new Date().getTime(),
      testResultStatus: [Constant.testResultStatus.NEW, Constant.testResultStatus.SAVED],
      selectAll: false,
      autoInsert: false,
      autoInsertObj: {},
      disabledDelBtn: true,
      loading: false,
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
        return Api.Analyzer.query().$promise.then(function(data) {
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
      getAnalyzerResults: function(status, flagAll){
        vm.loading = true;
        var analyzerID = null;
        if(vm.search.analyzer) {
          analyzerID = vm.search.analyzer._id;
        }
        // send request with filter condition and get return data
        return Api.AnalyzerResult.get({
          page: vm.currentPage,
          analyzer: analyzerID,
          status: (status === '') ? null : status,
          testType: (vm.search.testType === '') ? null : vm.search.testType,
          beginDate: (vm.timestamp === '') ? null : vm.timestamp,
          accessionNumber: (vm.search.accessionNumber === '') ? null : vm.search.accessionNumber,
          limit: flagAll ? 0 : vm.recordPerPage
        }).$promise.then(function(data) {
            console.log(Constant.msg.analyzerResult.MSG_LOAD_DATA_SUCCESS + new Date());
            vm.analyzerResults = data.analyzerResult;
            vm.totalItems = data.totalAnalyzerResult;
            vm.disabledEntryBtn = vm.noData = (data.totalAnalyzerResult === 0);

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
        })
        .finally(function() {
          vm.loading = false;
        });
      },

      /**
        auto insert all test results to OpenELIS system
      */
      onAutoInsertChange: function() {
        // Update system config auto-insert in database
        var isAutoInsert = vm.autoInsert.toString();
        vm.autoInsertObj.value = isAutoInsert;
        Setting.save(vm.autoInsertObj.key, vm.autoInsertObj)
        .then(vm.getAutoInsert);
      },

      /**
       * Increase or decrease countCheck when user checks or unchecks record
       * @param  {Boolean} isCheck
       */
      check: function (isCheck) {
        vm.selectAll = false;
        vm.countCheck = isCheck ? ++vm.countCheck : --vm.countCheck;
        vm.disabledDelBtn = (vm.countCheck > 0 & !vm.loading) ? false : true;
      },

      /**
        select all or deselect all analyzer results
      */
      checkAll: function() {
        var checkNumber = vm.selectAll ? 1 : -1;
        vm.analyzerResults.forEach(function(analyzerResult) {
          if (analyzerResult.selected != vm.selectAll) {
          analyzerResult.selected = vm.selectAll;
            vm.countCheck += checkNumber;
          }
        });
        vm.disabledDelBtn = !vm.selectAll;
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
        vm.loading = true;
        var deferred = $q.defer();
        Api.AnalyzerResult.update(data).$promise
          .then(function(res) {
            ModalService.successTransfer(res);
            deferred.resolve();
          })
          .catch(function (err) {
            deferred.reject(err.data);
            var alertErrorModal = ModalService.error(err.data);
            // open error message modal
            return alertErrorModal.result.then(function() {
              vm.getAnalyzerResults(vm.search.status);
            });
          })
          .finally(function() {
            vm.loading = false;
          });
        return deferred.promise;
      },

      updateAccessionNumber: function(data) {
        var deferred = $q.defer();
        Api.AnalyzerResult.update({ id: data._id }, data).$promise
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
      onResultEntry: function(notShowMessage) {
        // Check analyzer result is empty
        if (vm.noData) {
          return ModalService.error(Constant.testResultError.ANALYZER_RESULT_EMPTY);
        }
        // init
        var ids = [],
            data = {},
            properties = {},
            less10Characters = false;
        // collect data, push all records id of current page to ids
        vm.getAnalyzerResults(vm.search.status, true).then(function () {
          vm.analyzerResults.forEach(function(analyzerResult) {
            var strAccessionNumber = analyzerResult.accessionNumber.trim();
            if (strAccessionNumber.length == 10) {
              ids.push(analyzerResult._id);
            } else {
              less10Characters = true;
            }
          });
          // Do not transfer tests which have accession number < 10 characters
          if (less10Characters && !notShowMessage) {
            ModalService.error(Constant.testResultError.LESS10_ACCESSIONUMBER);
          }
          properties = { status: Constant.testResultStatus.SAVED };
          data = {
            ids: ids,
            properties: properties
          };
          // call API
          if(data.ids.length>0) {
            // Disabled delete button
            vm.disabledDelBtn = true;
            vm.updateStatus(data).then(function() {
              vm.getAnalyzerResults(vm.search.status);
              console.log(Constant.msg.analyzerResult.MSG_UPDATE_DATA_SUCCESS + new Date());
            }, function() {
              console.log(Constant.msg.analyzerResult.MSG_UPDATE_DATA_UNSUCCESS + new Date());
            });
          }
        });
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
          var alertErrorModal = ModalService.error(Constant.testResultError.EDIT_ACCESSIONUMBER, true);
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
          var confirmDelete = ModalService.confirmDelete(ids);
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
      },

      getAutoInsert: function() {
        Setting.get(Constant.setting.AUTO_INSERT)
        .then(function (setting) {
          vm.autoInsertObj = setting;
          vm.autoInsert = vm.autoInsertObj.value === 'true' ? true : false;
        });
      },

      createAnalyzerResult: function(accNumber, result) {
        var analyzerResult = angular.extend(angular.copy(result), { accessionNumber: accNumber, testType: null });
        // Remove id.
        delete analyzerResult["_id"];
        return analyzerResult;
      },

      /**
       * Create analyzer results from accession numbers.
       */
      saveAccessionNumbers: function(analyzerResult, accessionNumbers) {
        // failResults save accession numbers have already exited in db
        var addAccNumbersModal = ModalService.addAccNumber(analyzerResult, accessionNumbers),
            saveAccessionNumPromises = [];
        addAccNumbersModal.result.then(function(accessionNumberInputs) {
            saveAccessionNumPromises = accessionNumberInputs.map(function(accessionNumberInput) {
            var resultObj = vm.createAnalyzerResult(accessionNumberInput.value, analyzerResult);
            return Api.AnalyzerResult.save(resultObj).$promise;
          });

          $q.all(saveAccessionNumPromises).then(function(testResultRes) {
            var failResults = _.filter(testResultRes, { 'success': false });
            if (failResults.length !== 0) {
              failResults = failResults.map(function(result) { return result.data; });
              var failAccessionNumberModal = ModalService.failSaveAccNumber(failResults);
              failAccessionNumberModal.result.then(function(accessionNumbers) {
                vm.saveAccessionNumbers(analyzerResult, accessionNumbers);
              });
            }
            vm.getAnalyzerResults();
          });
        });
      },

      editAccNumber: function(analyzerResult, editAccNumberFrm) {
        if (analyzerResult.testType !== Constant.POOL || analyzerResult.resultStr === Constant.testResultStr.POSITIVE) {
          return editAccNumberFrm.$show();
        }
        // if test is pool specimen
        vm.saveAccessionNumbers(analyzerResult);
      }
      
    });

    // on page loaded
    vm.getAutoInsert();
    vm.search.status = Constant.testResultStatus.NEW;
    vm.getAnalyzerResults(vm.search.status);
    vm.getAnalyzers();

    // Using $interval service to send analyzers-test-result every 60 seconds
    var annalyzerResultRefreshInterval = $interval( function(){
      if (vm.autoInsert && !vm.noData) {
//        var notShowMessage = true;
//        vm.onResultEntry(notShowMessage);
      }
    }, 30000);
    vm.removeListener = $rootScope.$on('$stateChangeStart', function() {
      $interval.cancel(annalyzerResultRefreshInterval);
      vm.removeListener();
    });
  });
