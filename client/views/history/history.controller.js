'use strict';

angular.module('openAim')
  .controller('HistoryCtrl', function (ModalService, Api, Constant, $location) {

    var vm = this;

    angular.extend(vm, {

      // init data
      name: 'HistoryCtrl',
      analyzers: [],
      histories : [],
      search: {
        analyzer: {},
        fromDate: null,
        toDate: null
      },
      toDateTimestamp: '',
      fromDateTimestamp: '',

      // pagination config
      recordPerPage: Constant.record_per_page.HISTORY,
      currentPage: 1,
      totalItems: 0,

      dateOptions: {
        formatYear: 'yyyy',
        maxDate: null,
        minDate: null,
        startingDay: 1
      },
      noData: true,

      // Datetimepicker define
      dtpTo: {
        opened: false
      },
      dtpFrom: {
        opened: false
      },

      /**
        datetimepicker (To Date) open
      */
      dtpToOpen: function() {
        return vm.dtpTo.opened = true;
      },

      /**
        datetimepicker (From Date) open
      */
      dtpFromOpen: function() {
        return vm.dtpFrom.opened = true;
      },

      /**
        get all analyzers and set selected property as false
      */
      getAnalyzers: function(){
        return Api.Analyzer.query().$promise.then(function(data) {
          console.log(Constant.msg.analyzer.MSG_LOAD_DATA_SUCCESS + new Date());
          vm.analyzers = data;
          return data;
        }, function() {
          console.log(Constant.msg.analyzer.MSG_LOAD_DATA_SUCCESS + new Date());
          return false;
        });
      },

      /**
        get histories
      */
      getHistories: function(){
        // send request with the filter conditions and get return data
        return Api.History.get({
          page: vm.currentPage,
          analyzerId: (vm.search.analyzer) ? vm.search.analyzer._id : null ,
          fromDate: (vm.fromDateTimestamp === '') ? null : vm.fromDateTimestamp,
          toDate: (vm.toDateTimestamp === '') ? null : vm.toDateTimestamp,
          limit: vm.recordPerPage
        }).$promise.then(function(data) {
            console.log(Constant.msg.histories.MSG_LOAD_DATA_SUCCESS + new Date());
            vm.histories = data.historyResult;
            vm.totalItems = data.totalHistoryResult;
            vm.noData = (data.totalHistoryResult === 0);
            return data;
        }, function() {
          console.log(Constant.msg.histories.MSG_LOAD_DATA_UNSUCCESS + new Date());
          return false;
        });
      },

      /**
        search test results
      */
      onSearch: function() {

        // Clear ?latest flag
        $location.search({});

        vm.setPage(1);
        vm.fromDateTimestamp = vm.search.fromDate ? vm.search.fromDate.getTime() : '';
        vm.toDateTimestamp = vm.search.toDate ? vm.search.toDate.getTime() : '';
        if(vm.fromDateTimestamp === '' && vm.toDateTimestamp === '') {
          ModalService.error(Constant.msg.histories.MSG_ERROR_MISSING_DATE);
          return false;
        }

        if (vm.fromDateTimestamp !== '' && vm.toDateTimestamp !== '' && (vm.fromDateTimestamp > vm.toDateTimestamp)) {
          ModalService.error(Constant.msg.histories.MSG_ERROR_DATE);
          vm.search.toDate = '';
          vm.search.fromDate = '';
          return false;
        }
        return vm.getHistories();
      },

      /**
        set page
        @param pageNo
      */
      setPage: function (pageNo) {
        return vm.currentPage = pageNo;
      },

      /**
        change page
      */
      pageChanged: function() {
        return vm.getHistories();
      },

      /**
        break word the long text
        @param str: input text
        @param width: the max width
        @param brk
        @param cut
      */
      wordwrap: function( str, width, brk, cut ) {
        brk = brk || '\n';
        width = width || 130;
        cut = cut || false;
        if (!str) {
          return str;
        }
        var regex = '.{1,' +width+ '}(\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\S+?(\s|$)');
        return str.match( RegExp(regex, 'g') ).join( brk );
       }

    });

    // on page loaded
    vm.getAnalyzers();
    // Check the detail param. If the equal "true" get histories
    var latest = $location.search().latest;
    if (latest) {
      vm.getHistories();
    }
  });
