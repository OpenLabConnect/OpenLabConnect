'use strict';

angular.module('openAim')
  .controller('LatestTestCtrl', function ($uibModal, testRes, Constant) {

    var vm = this;

    angular.extend(vm, {
      // init data
      name: 'LatestTestCtrl',
      tests: [],

      // pagination config
      recordPerPage: Constant.record_per_page.TEST,
      currentPage: 1,
      totalItems: 0,

      /**
    		load latest tests
  	 		@param: latest (boolean)
        	latest = false : load current data
        	latest = true : update data from OpenELIS
      */
      getLatestTest: function(latest){
        // send request with the filter conditions and get return data
      	return testRes.load({
      		latest: latest,
      		page: vm.currentPage,
      		limit: vm.recordPerPage
      	}).$promise.then(function(data) {
	        console.log(Constant.msg.test.MSG_LOAD_DATA_SUCCESS + new Date());
	        vm.tests = data.testResult;
	        vm.totalItems = data.totalTestResult;
          if (latest === true) {
            var alertModal = $uibModal.open({
              templateUrl: 'alert-modal-get-latest-test',
              controller: 'AlertModalGetLatestCtrl',
              size: 'sm',
              animation: true,
              resolve: {
                popupMessage: function() {
                  var msg = Constant.msg.test.MSG_GET_OK;
                  return msg;
                },
                updateStatus: data.updateStatus
              }
            });
            // open message modal
            return alertModal.result.then(function() {}); 
          }
          return data;
      	}, function() {
	        console.log(Constant.msg.test.MSG_LOAD_DATA_SUCCESS + new Date());
          if (latest === true) {
            var alertModal = $uibModal.open({
              templateUrl: 'alert-modal-get-latest-test',
              controller: 'AlertModalGetLatestCtrl',
              size: 'sm',
              animation: true,
              resolve: {
                popupMessage: function() {
                  var msg = Constant.msg.test.MSG_GET_NOT_OK;
                  return msg;
                },
                updateStatus: null
              }
            });
            // open message modal
            return alertModal.result.then(function() {}); 
          }
          return false;
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
		    vm.getLatestTest(false);
		  },

      /**
        update data from OpenELIS and reload
      */
		  onGetLatest: function() {
        vm.setPage(1);
		  	vm.getLatestTest(true);
		  }

    });

    // on page loaded
		vm.getLatestTest(false);
  })
  .controller('AlertModalGetLatestCtrl', function ($scope, Constant, $uibModalInstance, popupMessage, updateStatus) {
    $scope.popupMessage = popupMessage;
    if (updateStatus) {
      // Showing the number of creared test
      if (updateStatus.numberCreated > 0) {
        $scope.translationDataCreated = {
          created: updateStatus.numberCreated
        };
        $scope.numberCreated = Constant.msg.test.MSG_CREATED_OK;
      }
      // Showing the number of updated test
      if (updateStatus.numberUpdated > 0) {
        $scope.translationDataUpdated = {
          updated: updateStatus.numberUpdated
        };
        $scope.numberUpdated = Constant.msg.test.MSG_UPDATED_OK;
      }
    }
    $scope.close = function () {
      $uibModalInstance.close();
    };
  });
