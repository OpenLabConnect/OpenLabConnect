'use strict';

describe('Controller: TestResultCtrl', function () {

  beforeEach(module('openAim'));

  var UploadCtrl,
    fileUpload,
    analyzerResultsRes,
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

  beforeEach(inject(function ($controller, $rootScope, _fileUpload_, $httpBackend) {
    scope = $rootScope.$new();
    fileUpload = _fileUpload_;
    UploadCtrl = $controller('UploadCtrl', {
      $scope: scope
    });
    http = $httpBackend;
    http.whenGET('api/analyzers').respond(200, analyzerResMock);
    http.whenGET('views/login/login.html').respond(200);
    http.whenGET('views/analyzer/analyzer.html').respond(200);
  }));

  it('should have a TestResultCtrl controller', function () {
    expect(UploadCtrl).toBeDefined();
  });

  it('should have a analyzerRes service', function () {
    expect(fileUpload).toBeDefined();
  });

  it('should have init data', function () {
    expect(UploadCtrl.uploadFile).toBeDefined();
  });

});
