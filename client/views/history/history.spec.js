'use strict';

describe('Controller: HistoryCtrl', function () {

  beforeEach(module('openAim'));

  var HistoryCtrl,
      AnalyzerRes,
      HistoryRes,
      http,
      scope,
      analyzerResMock = [
        {
          "_id": "571ed78e426cb3e01edba00f",
          "fileType": "xlsx",
          "location": "location of file xlsx",
          "name": "name 002",
          "description": "description 002",
          "protocol": "file",
          "actived": true,
          "enabled": true,
          "__v": 0,
          "__t": "file-analyzer"
        },
        {
          "_id": "571eddac48b104101eae324c",
          "ip": "127.0.0.6",
          "port": 8086,
          "name": "name 006",
          "description": "description 006",
          "protocol": "net",
          "actived": true,
          "enabled": true,
          "__v": 0,
          "__t": "network-analyzer"
        },
        {
          "_id": "571ee0ccce5202541989f739",
          "comPort": "COM 1",
          "baudRate": "baudRate 001",
          "stopBit": 1,
          "parity": 500,
          "dataBit": 8,
          "flowControl": "flowControl",
          "name": "name 003",
          "description": "003",
          "protocol": "serial",
          "actived": true,
          "enabled": true,
          "__v": 0,
          "__t": "serial-analyzer"
        }
      ],
      historyResMock = {
        "historyResult": [
          {
            "_id": "57457b3a91655d5821d7ede4",
            "analyzer": {
              "_id": "571ee0ccce5202541989f739",
              "comPort": "COM 1",
              "baudRate": "baudRate 001",
              "stopBit": 1,
              "parity": 500,
              "dataBit": 8,
              "flowControl": "flowControl",
              "name": "name 003",
              "description": "003",
              "protocol": "serial",
              "actived": true,
              "enabled": true,
              "__v": 0,
              "__t": "serial-analyzer"
            },
            "user": "test@test.com",
            "action": "Update analyzer",
            "data": "{\"_id\":\"571ee0ccce5202541989f739\",\"comPort\":\"COM 1\",\"baudRate\":\"baudRate 001\",\"stopBit\":1,\"parity\":500,\"dataBit\":8,\"flowControl\":\"flowControl\",\"name\":\"name 003\",\"description\":\"003\",\"protocol\":\"serial\",\"actived\":false,\"enabled\":true,\"__v\":0,\"__t\":\"serial-analyzer\"}",
            "brief": "Updated analyzer: name 003\n Changed status from false to true",
            "table": {
              "_id": "570f228a989d81341bc59090",
              "name": "analyzers",
              "__v": 0
            },
            "__v": 0,
            "timestamp": "2016-05-25T10:15:22.605Z"
          },
          {
            "_id": "57457b3a91655d5821d7ede3",
            "analyzer": {
              "_id": "571eddac48b104101eae324c",
              "ip": "127.0.0.6",
              "port": 8086,
              "name": "name 006",
              "description": "description 006",
              "protocol": "net",
              "actived": true,
              "enabled": true,
              "__v": 0,
              "__t": "network-analyzer"
            },
            "user": "test@test.com",
            "action": "Update analyzer",
            "data": "{\"_id\":\"571eddac48b104101eae324c\",\"ip\":\"127.0.0.6\",\"port\":8086,\"name\":\"name 006\",\"description\":\"description 006\",\"protocol\":\"net\",\"actived\":false,\"enabled\":true,\"__v\":0,\"__t\":\"network-analyzer\"}",
            "brief": "Updated analyzer: name 006\n Changed status from false to true",
            "table": {
              "_id": "570f228a989d81341bc59090",
              "name": "analyzers",
              "__v": 0
            },
            "__v": 0,
            "timestamp": "2016-05-25T10:15:22.604Z"
          },
          {
            "_id": "57457b3a91655d5821d7ede2",
            "analyzer": {
              "_id": "571ed78e426cb3e01edba00f",
              "fileType": "xlsx",
              "location": "location of file xlsx",
              "name": "name 002",
              "description": "description 002",
              "protocol": "file",
              "actived": true,
              "enabled": true,
              "__v": 0,
              "__t": "file-analyzer"
            },
            "user": "test@test.com",
            "action": "Update analyzer",
            "data": "{\"_id\":\"571ed78e426cb3e01edba00f\",\"fileType\":\"xlsx\",\"location\":\"location of file xlsx\",\"name\":\"name 002\",\"description\":\"description 002\",\"protocol\":\"file\",\"actived\":false,\"enabled\":true,\"__v\":0,\"__t\":\"file-analyzer\"}",
            "brief": "Updated analyzer: name 002\n Changed status from false to true",
            "table": {
              "_id": "570f228a989d81341bc59090",
              "name": "analyzers",
              "__v": 0
            },
            "__v": 0,
            "timestamp": "2016-05-25T10:15:22.604Z"
          },
          {
            "_id": "57457b2e91655d5821d7ede1",
            "analyzer": {
              "_id": "571ee0ccce5202541989f739",
              "comPort": "COM 1",
              "baudRate": "baudRate 001",
              "stopBit": 1,
              "parity": 500,
              "dataBit": 8,
              "flowControl": "flowControl",
              "name": "name 003",
              "description": "003",
              "protocol": "serial",
              "actived": true,
              "enabled": true,
              "__v": 0,
              "__t": "serial-analyzer"
            },
            "user": "test@test.com",
            "action": "Update analyzer",
            "data": "{\"_id\":\"571ee0ccce5202541989f739\",\"comPort\":\"COM 1\",\"baudRate\":\"baudRate 001\",\"stopBit\":1,\"parity\":500,\"dataBit\":8,\"flowControl\":\"flowControl\",\"name\":\"name 003\",\"description\":\"003\",\"protocol\":\"serial\",\"actived\":true,\"enabled\":true,\"__v\":0,\"__t\":\"serial-analyzer\"}",
            "brief": "Updated analyzer: name 003\n Changed status from true to false",
            "table": {
              "_id": "570f228a989d81341bc59090",
              "name": "analyzers",
              "__v": 0
            },
            "__v": 0,
            "timestamp": "2016-05-25T10:15:10.972Z"
          }
        ],
        "totalHistoryResult": 4
      };

  beforeEach(inject(function ($controller, $rootScope, analyzerRes, historyRes, $httpBackend) {
    scope = $rootScope.$new();
    AnalyzerRes = analyzerRes;
    HistoryRes = historyRes;
    http = $httpBackend;
    http.whenGET('api/histories?limit=20&page=1').respond(200, historyResMock);
    http.whenGET('api/analyzers').respond(200, analyzerResMock);
    http.whenGET('views/analyzer/analyzer.html').respond(200);
    http.whenGET('views/login/login.html').respond(200);

    HistoryCtrl = $controller('HistoryCtrl', {
      $scope: scope
    });
  }));

  it('Should have a HistoryCtrl controller', function() {
    expect(HistoryCtrl).toBeDefined();
  });

  it('Should have a AnalyzerRes service', function() {
    expect(AnalyzerRes).toBeDefined();
  });

  it('Should have a HistoryRes service', function() {
    expect(HistoryRes).toBeDefined();
  });

  it('Should have init data', function() {
    expect(HistoryCtrl.search).toBeDefined();
    expect(HistoryCtrl.recordPerPage).toBeDefined();
    expect(HistoryCtrl.dateOptions).toBeDefined();
    expect(HistoryCtrl.dtpTo.opened).toEqual(false);
    expect(HistoryCtrl.dtpFrom.opened).toEqual(false);
  });

  it('dtpToOpen Should return true', function() {
    expect(HistoryCtrl.dtpToOpen()).toEqual(true);
  });

  it('dtpFromOpen Should return true', function() {
    expect(HistoryCtrl.dtpFromOpen()).toEqual(true);
  });

  it('dtpFromOpen Should return true', function() {
    expect(HistoryCtrl.dtpFromOpen()).toEqual(true);
  });

  it('getAnalyzers function Should return data', function() {
    HistoryCtrl.getAnalyzers()
    .then(function (result) {
      expect(result.length).toEqual(analyzerResMock.length);
    });
    http.flush();
  });

  it('getHistories function Should return data', function() {
    HistoryCtrl.getHistories()
    .then(function (data) {
      expect(data.totalHistoryResult).toEqual(historyResMock.totalHistoryResult);
    });
    http.flush();
  });

  it('getHistories function Should return data when search with fromdate and todate', function() {
    http.whenGET('api/histories?fromDate=1462035600000&limit=20&page=1&toDate=1462813200000').respond(200, historyResMock);
    HistoryCtrl.fromDateTimestamp = '1462035600000';
    HistoryCtrl.toDateTimestamp = '1462813200000';
    HistoryCtrl.getHistories()
    .then(function (data) {
      expect(data.totalHistoryResult).toEqual(historyResMock.totalHistoryResult);
    });
    http.flush();
  });

  it('getHistories function Should return data when search with fromdate, without todate', function() {
    http.whenGET('api/histories?fromDate=1462035600000&limit=20&page=1').respond(200, historyResMock);
    HistoryCtrl.fromDateTimestamp = '1462035600000';
    HistoryCtrl.getHistories()
    .then(function (data) {
      expect(data.totalHistoryResult).toEqual(historyResMock.totalHistoryResult);
    });
    http.flush();
  });

  it('getHistories function Should return data when search with todate, without fromdate', function() {
    http.whenGET('api/histories?limit=20&page=1&toDate=1462035600000').respond(200, historyResMock);
    HistoryCtrl.toDateTimestamp = '1462035600000';
    HistoryCtrl.getHistories()
    .then(function (data) {
      expect(data.totalHistoryResult).toEqual(historyResMock.totalHistoryResult);
    });
    http.flush();
  });

  it('getHistories function Should return data when search with analyzerID', function() {
    http.whenGET('api/histories?analyzerId=571ed78e426cb3e01edba00f&limit=20&page=1').respond(200, historyResMock);
    HistoryCtrl.search.analyzer = {'_id': '571ed78e426cb3e01edba00f' };
    HistoryCtrl.getHistories()
    .then(function (data) {
      expect(data.totalHistoryResult).toEqual(historyResMock.totalHistoryResult);
    });
    http.flush();
  });

  it('getHistories function Should return data when search with full option', function() {
    http.whenGET('api/histories?analyzerId=571ed78e426cb3e01edba00f&fromDate=1462208400000&limit=20&page=1&toDate=1463504400000')
    .respond(200, historyResMock);
    HistoryCtrl.search.analyzer = {'_id': '571ed78e426cb3e01edba00f' };
    HistoryCtrl.toDateTimestamp = '1463504400000';
    HistoryCtrl.fromDateTimestamp = '1462208400000';
    HistoryCtrl.getHistories()
    .then(function (data) {
      expect(data.totalHistoryResult).toEqual(historyResMock.totalHistoryResult);
    });
    http.flush();
  });

  it('setPage Should return page right number', function() {
    var numberPage = 100;
    expect(HistoryCtrl.setPage(numberPage)).toEqual(numberPage);
  });


});