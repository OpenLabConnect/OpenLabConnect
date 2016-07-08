'use strict';

angular.module('openAim')
  .controller('assignStaffCtrl', function (analyzerRes, Constant, $q) {

    var vm = this;

    angular.extend(vm, {
       // init data
      name: 'assignStaffCtrl',
      analyzers:[],

      /**
        load data: get assign staff with their analyzer
      */
      getAssignStaff: function(){
        // Get analyzer
        return vm.getAnalyzers();
      },

      /**
        get all analyzers
      */
      getAnalyzers: function(){
        analyzerRes.query().$promise.then(function(data) {
          console.log(Constant.msg.analyzer.MSG_LOAD_DATA_SUCCESS + new Date());
          vm.analyzers = data;
          return vm.analyzers;
        }, function() {
          console.log(Constant.msg.analyzer.MSG_LOAD_DATA_UNSUCCESS + new Date());
          return false;
        });
      },
      onAssignStaffSave: function(analyzer) {
        if (!analyzer.performedBy) {
          analyzer.performedBy = '';
        }
        vm.assignStaff(analyzer).then(function() {
          console.log(Constant.msg.analyzer.MSG_UPDATE_SUCCESS + new Date());
        }, function() {
          vm.getAnalyzers();
          console.log(Constant.msg.analyzer.MSG_UPDATE_UNSUCCESS + new Date());
        });
      },
      /***
       * Assign analyzer mechine for staff
       * @param {type} staffName
       */
      assignStaff: function(staffName) {
        var deferred = $q.defer();
        analyzerRes.update({ id: staffName._id }, staffName).$promise
          .then(function() {
            deferred.resolve();
          })
          .catch(function (err) {
            deferred.reject(err.data);
          });
        return deferred.promise;
      }
    });
    // on page loaded
    vm.getAssignStaff();
  });