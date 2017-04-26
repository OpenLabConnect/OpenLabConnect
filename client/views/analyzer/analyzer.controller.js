'use strict';

angular.module('openAim')
  .controller('AnalyzerCtrl', function (Api, Constant, $q, $interval, $rootScope, ModalService) {

    var vm = this;

    angular.extend(vm, {
      // init data
      name: 'AnalyzerCtrl',
      analyzers: [],
      selectAll: false,
      total: 0,
      isActive: null,
      isCheck: false,
      // allActive is true when all analyzers are operating
      allActive: null,
      // intricacy is true when some of analyzers are operating
      intricacy: null,
      analyzerProtocol: Constant.analyzerProtocol,

      /**
        get all analyzers and set selected property as false
      */
      getAnalyzers: function(){
        // send request and get return data
      	return Api.Analyzer.query().$promise.then(function(data) {
	        console.log(Constant.msg.analyzer.MSG_LOAD_DATA_SUCCESS + new Date());
	        vm.analyzers = data;
          // quantity of analyzers
          vm.total = data.length;
          vm.analyzers.forEach(function(analyzer) {
            analyzer.selected = false;
            analyzer.params = '';
            switch(analyzer.protocol) {
              case Constant.analyzerProtocol.SERIAL:
                analyzer.params = analyzer.baudRate + ', ' + analyzer.stopBit + ', ' +
                 analyzer.parity + ', ' + analyzer.dataBit + ', ' + analyzer.flowControl;
                analyzer.port = analyzer.comPort;
                break;
              case Constant.analyzerProtocol.NET:
                analyzer.params = analyzer.ip;
                break;
              case Constant.analyzerProtocol.FILE:
                analyzer.params = analyzer.fileType + ', ' + analyzer.location;
                break;
            }
          });
          vm.checkStatus();
          vm.checked();
          return true;
      	}, function() {
	        console.log(Constant.msg.analyzer.MSG_LOAD_DATA_UNSUCCESS + new Date());
          return false;
	   		});
      },

      /**
         select all or deselect all analyzers
      */
      checkAll: function() {
        vm.analyzers.forEach(function(analyzer) {
          analyzer.selected = vm.selectAll;
        });
      },

      /**
        Change the status color of analyzer with bootstrap style
        @param : status
        @return: string
      */
      statusIcon: function(status) {
        return (status === Constant.analyzerStatus.OPENED) ?
        Constant.css.analyzer_actived : Constant.css.analyzer_inactived;
      },

      /**
       Disable open, open all or close, close all button when analyzer active or none
       */
      checkStatus: function() {
        var openStatus = 0;
        vm.analyzers.forEach(function(analyzer) {
          openStatus += analyzer.actived === Constant.analyzerStatus.OPENED ? 1 : 0;
        });
        vm.allActive = (openStatus === vm.total);

        //The status of analyzer have both opened and closed
        vm.intricacy = (openStatus > 0 && openStatus < vm.total);
      },

      //Disable open or close button when the checkbox is checked
      checked: function(analyzer) {
        if (!analyzer) {
          vm.isCheck = false;
        } else {
          vm.isCheck = analyzer.selected;
          vm.isActive = analyzer.actived;
        }
      },

      /**
        update analyzers
        @param data
      */
      updateAnalyzers: function(data) {
        // TODO: get data and send to API via the update method
        // return promise
        var deferred = $q.defer();
        Api.Analyzer.update(data).$promise
          .then(function(data) {
            deferred.resolve(data);
          })
          .catch(function (err) {
            deferred.reject(err.data);
          });
        return deferred.promise;
      },

      /**
        Update analyzers status
        @param all: boolean (true: update all)
        @param status: boolean (true: open, false: close)
      */
      updateAnalyzersStatus: function(all, status) {
        // init
        var ids = [],
            data = {},
            properties = {};
        // collect data
        vm.analyzers.forEach(function(analyzer) {
          if((analyzer.selected || all) && analyzer.actived !== status) {
             ids.push(analyzer._id);
          }
        });
        properties = { actived: status };
        data = {
          ids: ids,
          properties: properties
        };

        // call API
        if (data.ids.length > 0) {
          vm.updateAnalyzers(data).then(function() {
            vm.analyzers = vm.getAnalyzers();
            vm.selectAll = false;            
            console.log(Constant.msg.analyzer.MSG_UPDATE_SUCCESS + new Date());
          }, function(err) {
            console.log(Constant.msg.analyzer.MSG_UPDATE_UNSUCCESS + new Date());
            if (err.code === Constant.msg.analyzerServer.disconnectOpenLabConnectToAnalyzer) {
              ModalService.error(Constant.msg.analyzerServer.disconnectOpenLabConnectToAnalyzer); 
            }
          });
        }
      },

    });

    // on page loaded
    vm.getAnalyzers();
    // Using $interval service to get analyzers every 60 seconds
    var annalyzerRefreshInterval = $interval( function(){ vm.getAnalyzers(); }, 60000);
    vm.removeListener = $rootScope.$on('$stateChangeStart', function() {
      $interval.cancel(annalyzerRefreshInterval);
      vm.removeListener();
    });
  });
