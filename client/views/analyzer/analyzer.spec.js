'use strict';

describe('Controller: AnalyzerCtrl', function () {

  var AnalyzerCtrl,
      analyzerResource,
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
      ];
  beforeEach(module('openAim'));
  beforeEach(inject(function ($controller, $rootScope, analyzerRes,$httpBackend) {
    scope = $rootScope.$new();
    analyzerResource = analyzerRes;
    http = $httpBackend;
    AnalyzerCtrl = $controller('AnalyzerCtrl', {
      $scope: scope
    });
    http.whenGET('views/login/login.html').respond(200);
    http.whenGET('views/analyzer/analyzer.html').respond(200);
    http.whenGET('api/analyzers').respond(200, analyzerResMock);
  }));

  it('Should have a AnalyzerCtrl controller', function() {
    expect(AnalyzerCtrl).toBeDefined();
  });

  it('Should have a analyzerResource service', function() {
    expect(analyzerResource).toBeDefined();
  });

  it('SelectAll variable should have value is false', function() {
    expect(AnalyzerCtrl.selectAll).toEqual(false);
  });

  it('Should have a getAnalyzers function in AnalyzerCtrl controller', function() {
    expect(AnalyzerCtrl.getAnalyzers).toBeDefined();
  });

  it('getAnalyzer function should return true', function () {
    AnalyzerCtrl.getAnalyzers()
    .then(function (result) {
      expect(result.lenght).toEqual(analyzerResMock.length);
    });
  });

  it('Should have a statusIcon fucntion in Analyzer Controller', function() {
    expect(AnalyzerCtrl.statusIcon).toBeDefined();
  });

  it('statusIcon fucntion should change status', function() {
    expect(AnalyzerCtrl.statusIcon(true)).toEqual('ok-sign text-success');
    expect(AnalyzerCtrl.statusIcon(false)).toEqual('minus-sign text-danger');
  });

  it('Should have a updateAnalyzers function in Analyzer Controller', function() {
    expect(AnalyzerCtrl.updateAnalyzers).toBeDefined();
  });

  it('updateAnalyzers fucntion should return promise', function() {
    var responseMock = true;
    http.whenPUT('api/analyzers').respond(200, responseMock);
    AnalyzerCtrl.updateAnalyzers()
    .then(function (promise) {
      expect(promise.$resolved).toEqual(responseMock);
    });
    http.flush();
  });


});
