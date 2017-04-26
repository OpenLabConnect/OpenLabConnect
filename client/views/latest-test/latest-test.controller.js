'use strict';

angular.module('openAim')
  .controller('LatestTestCtrl', function (Api, ModalService, Constant) {

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
      	return Api.Test.get({
      		latest: latest,
      		page: vm.currentPage,
      		limit: vm.recordPerPage
      	}).$promise.then( function(data) {
	        console.log(Constant.msg.test.MSG_LOAD_DATA_SUCCESS + new Date());
	        vm.tests = data.testResult;
	        vm.totalItems = data.totalTestResult;
          if (latest === true) {
            ModalService.successLatestTest(Constant.msg.test.MSG_GET_OK, data.updateStatus);
          }
          return data;
      	}, function() {
	        console.log(Constant.msg.test.MSG_LOAD_DATA_UNSUCCESS + new Date());
          if (latest === true) {
            ModalService.error(Constant.msg.test.MSG_GET_NOT_OK);
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
  });

