'use strict';

describe('Controller: TestMapCtrl', function () {

  beforeEach(module('openAim'));

  var TestMapCtrl,
    analyzerRes,
    testMapRes,
    testRes,
    http,
    scope,
    testMapResMock = {
      "analyzerTestMapResult": [
        {
          "_id": "57345e9ed7d4ac7819449785",
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
          "testCode": "IgG-ELISA DENGUE",
          "__v": 0,
          "test": {
            "_id": "5732d1930adb33281e40774c",
            "name": "ELISA IgG Dengue",
            "description": "Phát hiện kháng thể IgG kháng vi rút sốt xuất huyết (DENGUE)",
            "normalRange": "",
            "unit": "",
            "section": "Arbovirus",
            "testId": "342",
            "__v": 0
          }
        },
        {
          "_id": "57355cff7950aa381d39d0bf",
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
          "testCode": "MAC-ELISA JE",
          "__v": 0,
          "test": {
            "_id": "5732d1930adb33281e40774f",
            "name": "ELISA IgM JE",
            "description": "Phát hiện kháng thể IgM kháng vi rút viêm não Nhật Bản (JE)",
            "normalRange": "",
            "unit": "",
            "section": "Arbovirus",
            "testId": "343",
            "__v": 0
          }
        },
        {
          "_id": "57355d1f7950aa381d39d0c2",
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
          "testCode": "MAC-ELISA DENGUE",
          "__v": 0,
          "test": {
            "_id": "5732d1930adb33281e40774e",
            "name": "ELISA IgM Dengue",
            "description": "Phát hiện kháng thể IgM kháng vi rút sốt xuất huyết (DENGUE)",
            "normalRange": "",
            "unit": "",
            "section": "Arbovirus",
            "testId": "341",
            "__v": 0
          }
        },
        {
          "_id": "57359b7a9a5d4adc078cd514",
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
          "testCode": "IgG-ELISA HANTAN",
          "test": {
            "_id": "5732d1930adb33281e40774b",
            "name": "ELISA IgG Hantan",
            "description": "Phát hiện kháng thể IgG kháng vi rút Hantan",
            "normalRange": "",
            "unit": "",
            "section": "Arbovirus",
            "testId": "349",
            "__v": 0
          },
          "__v": 0
        },
        {
          "_id": "5735a32e59134d481c7c1ddf",
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
          "testCode": "IgM-ELISA HANTAN",
          "test": {
            "_id": "5732d1930adb33281e40774d",
            "name": "ELISA IgM Hantan",
            "description": "Phát hiện kháng thể IgM kháng vi rút Hantan",
            "normalRange": "",
            "unit": "",
            "section": "Arbovirus",
            "testId": "348",
            "__v": 0
          },
          "__v": 0
        },
        {
          "_id": "5735acf34511eeac210427e8",
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
          "testCode": "DENGUE NS1 Ag",
          "test": {
            "_id": "5732d1930adb33281e407749",
            "name": "ELISA NS1",
            "description": "Phát hiện kháng nguyên NS1 vi rút gây Dengue",
            "normalRange": "",
            "unit": "",
            "section": "Arbovirus",
            "testId": "351",
            "__v": 0
          },
          "__v": 0
        }
      ],
      "totalAnalyzerTestMapResult": 6
    },
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
    testsResMock = {
      "testResult": [
        {
          "_id": "5732d1930adb33281e407753",
          "name": "Acid Uric",
          "description": "Acid Uric(Nước tiểu)",
          "normalRange": "",
          "unit": "",
          "section": "Biochemistry",
          "testId": "94",
          "__v": 0
        },
        {
          "_id": "5732d1930adb33281e407754",
          "name": "Albumin điện di đạm",
          "description": "Albumin điện di đạm(Huyết thanh)",
          "normalRange": "",
          "unit": "",
          "section": "Biochemistry",
          "testId": "67",
          "__v": 0
        },
        {
          "_id": "5732d1930adb33281e407755",
          "name": "Albumin",
          "description": "Albumin(Huyết thanh)",
          "normalRange": "",
          "unit": "",
          "section": "Biochemistry",
          "testId": "28",
          "__v": 0
        },
        {
          "_id": "5732d1930adb33281e407756",
          "name": "Alpha 2 globulin",
          "description": "Alpha 2 globulin(Huyết thanh)",
          "normalRange": "",
          "unit": "",
          "section": "Biochemistry",
          "testId": "63",
          "__v": 0
        }
      ],
      "totalTestResult": 4
    },
    testMapMock = {
      "_id": "57345e9ed7d4ac7819449785",
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
      "testCode": "IgG-ELISA DENGUE",
      "__v": 0,
      "test": {
        "_id": "5732d1930adb33281e40774c",
        "name": "ELISA IgG Dengue",
        "description": "Phát hiện kháng thể IgG kháng vi rút sốt xuất huyết (DENGUE)",
        "normalRange": "",
        "unit": "",
        "section": "Arbovirus",
        "testId": "342",
        "__v": 0
      }
    };

  beforeEach(inject(function ($controller, $rootScope, _testRes_, _analyzerRes_, _testMapRes_, $httpBackend) {
    scope = $rootScope.$new();
    analyzerRes = _analyzerRes_;
    testMapRes = _testMapRes_;
    testRes = _testRes_;
    http = $httpBackend;
    TestMapCtrl = $controller('TestMapCtrl', {
      $scope: scope
    });
    http.whenGET('views/login/login.html').respond(200);
    http.whenGET('views/analyzer/analyzer.html').respond(200);
    http.whenGET('api/analyzers').respond(200, analyzerResMock);
    http.whenGET('api/tests?getLatest=false&limit=0').respond(200, testsResMock);
    http.whenGET('api/test-maps?limit=20&page=1').respond(200, testMapResMock);
  }));

  it('should have a analyzerRes service', function () {
    expect(TestMapCtrl).toBeDefined();
  });

  it('should have a testMapRes service', function () {
    expect(testMapRes).toBeDefined();
  });

  it('should have a testRes service', function () {
    expect(testRes).toBeDefined();
  });

  it('should have a analyzerRes service', function () {
    expect(analyzerRes).toBeDefined();
  });

  it('should have init data', function () {
    expect(TestMapCtrl.testMaps).toBeDefined();
    expect(TestMapCtrl.analyzers).toBeDefined();
    expect(TestMapCtrl.tests).toBeDefined();
    expect(TestMapCtrl.newTestMap).toBeDefined();
    expect(TestMapCtrl.search).toBeDefined();
    expect(TestMapCtrl.currentPage).toEqual(1);
    expect(TestMapCtrl.totalItems).toEqual(0);
  });

  it('getTestMaps function should return value without search', function () {
    TestMapCtrl.getTestMaps()
      .then(function (result) {
        expect(result.totalAnalyzerTestMapResult).toEqual(testMapResMock.totalAnalyzerTestMapResult);
      });
    http.flush();
  });

  it('getTestMaps function should return value with search', function () {
    http.whenGET('api/test-maps?limit=20&page=1&search=keyWord').respond(200, testMapResMock);
    TestMapCtrl.search = 'keyWord';
    TestMapCtrl.getTestMaps()
      .then(function (result) {
        expect(result.totalAnalyzerTestMapResult).toEqual(testMapResMock.totalAnalyzerTestMapResult);
      });
    http.flush();
  });

  it('getTestMaps function should return value with pageChange', function () {
    http.whenGET('api/test-maps?limit=20&page=2').respond(200, testMapResMock);
    TestMapCtrl.currentPage = 2;
    TestMapCtrl.getTestMaps()
      .then(function (result) {
        expect(result.totalAnalyzerTestMapResult).toEqual(testMapResMock.totalAnalyzerTestMapResult);
      });
    http.flush();
  });

  it('getAnalyzers function should return value', function () {
    TestMapCtrl.getAnalyzers()
      .then(function (result) {
        expect(result.length).toEqual(analyzerResMock.length);
      });
    http.flush();
  });

  it('getTests function should return value', function () {
    TestMapCtrl.getTests()
      .then(function (result) {
        expect(result.length).toEqual(testsResMock.length);
      });
    http.flush();
  });

  it('onSave function should return false when update with incomplete data', function () {
    var incompleteTestMap = {
      "_id": "57345e9ed7d4ac7819449785",
      "analyzer": "",
      "testCode": "",
      "__v": 0,
      "test": ""
    };
    expect(TestMapCtrl.onSave(incompleteTestMap)).toEqual(false);
  });

  it('setPage function should return correct pageNumber', function () {
    var pageNumber = 100;
    expect(TestMapCtrl.setPage(pageNumber)).toEqual(pageNumber);
  });

});

