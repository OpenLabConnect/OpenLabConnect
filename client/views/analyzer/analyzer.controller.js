'use strict';

angular.module('openAim')
  .controller('AnalyzerCtrl', function (analyzerRes, Constant, $q) {

    var vm = this;

    angular.extend(vm, {
      // init data
      name: 'AnalyzerCtrl',
      analyzers: [],
      selectAll: false,

      /**
        get all analyzers and set selected property as false
      */
      getAnalyzers: function(){
        // send request and get return data
      	return analyzerRes.query().$promise.then(function(data) {
	        console.log(Constant.msg.analyzer.MSG_LOAD_DATA_SUCCESS + new Date());
	        vm.analyzers = data;
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
        update analyzers
        @param data
      */
      updateAnalyzers: function(data) {
        // TODO: get data and send to API via the update method
        // return promise
        var deferred = $q.defer();
        analyzerRes.update(data).$promise
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
            vm.analyzers.forEach(function(analyzer) {
              if((analyzer.selected || all) && analyzer.actived !== status) {
                 analyzer.actived = status;
              }
            });
            vm.selectAll = false;
            vm.checkAll();
            console.log(Constant.msg.analyzer.MSG_UPDATE_SUCCESS + new Date());
          }, function() {
            console.log(Constant.msg.analyzer.MSG_UPDATE_UNSUCCESS + new Date());
          });
        }
      },

    });

    // on page loaded
    vm.getAnalyzers();
  });
