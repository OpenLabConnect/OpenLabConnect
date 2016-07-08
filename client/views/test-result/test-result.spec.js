'use strict';

describe('Controller: TestResultCtrl', function () {

  beforeEach(module('openAim'));

  var TestResultCtrl,
    analyzerRes,
    analyzerResultsRes,
    http,
    scope,
    responseMock = {
      analyzerResult: [
        {
            "_id": "5743cd5ea9f2c1b4168d74a0",
            "performedBy": "User",
            "accessionNumber": "1670000024",
            "completedDate": null,
            "lastUpdated": null,
            "transferDate": null,
            "status": "NEW",
            "result": {
                "_id": "5743cd5ea9f2c1b4168d7498",
                "result": "2.558",
                "type": {
                    "_id": "5732b46f349159128cccc54e",
                    "name": "value"
                },
                "__v": 0
            },
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
            "receivedDate": "2016-05-24T03:41:18.829Z"
        },
        {
            "_id": "5743cd5ea9f2c1b4168d749e",
            "performedBy": "User",
            "accessionNumber": "1670000023",
            "completedDate": null,
            "lastUpdated": null,
            "transferDate": null,
            "status": "NEW",
            "result": {
                "_id": "5743cd5ea9f2c1b4168d7495",
                "result": "-1",
                "type": {
                    "_id": "5732b41f349159128cccc54c",
                    "name": "result"
                },
                "__v": 0
            },
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
            "receivedDate": "2016-05-24T03:41:18.828Z"
        },
        {
            "_id": "5743cd5ea9f2c1b4168d749c",
            "performedBy": "User",
            "accessionNumber": "1670000023",
            "completedDate": null,
            "lastUpdated": null,
            "transferDate": null,
            "status": "NEW",
            "result": {
                "_id": "5743cd5ea9f2c1b4168d7496",
                "result": "0.221",
                "type": {
                    "_id": "5732b46f349159128cccc54e",
                    "name": "value"
                },
                "__v": 0
            },
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
            "receivedDate": "2016-05-24T03:41:18.827Z"
        },
        {
            "_id": "5743cd5ea9f2c1b4168d749a",
            "performedBy": "User",
            "accessionNumber": "1670000024",
            "completedDate": null,
            "lastUpdated": null,
            "transferDate": null,
            "status": "NEW",
            "result": {
                "_id": "5743cd5ea9f2c1b4168d7497",
                "result": "1",
                "type": {
                    "_id": "5732b41f349159128cccc54c",
                    "name": "result"
                },
                "__v": 0
            },
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
            "receivedDate": "2016-05-24T03:41:18.826Z"
        }],
      totalAnalyzerResult: 4
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
    ];

  beforeEach(inject(function ($controller, $rootScope, _analyzerRes_, _analyzerResultsRes_, $httpBackend) {
    scope = $rootScope.$new();
    analyzerRes = _analyzerRes_;
    analyzerResultsRes = _analyzerResultsRes_;
    TestResultCtrl = $controller('TestResultCtrl', {
      $scope: scope
    });
    http = $httpBackend;
    http.whenGET('api/analyzers').respond(200, analyzerResMock);
    http.whenGET('views/login/login.html').respond(200);
    http.whenGET('views/analyzer/analyzer.html').respond(200);
    http.whenGET('api/test-results?limit=50&page=1&receivedDate=' + TestResultCtrl.timestamp
      + '&status=NEW').respond(200, responseMock);
    http.whenGET('api/test-results?limit=50&page=1&receivedDate=' + TestResultCtrl.timestamp).respond(200, responseMock);
  }));

  it('should have a TestResultCtrl controller', function () {
    expect(TestResultCtrl).toBeDefined();
  });

  it('should have a analyzerRes service', function () {
    expect(analyzerRes).toBeDefined();
  });

  it('should have a analyzerResultsRes service', function () {
    expect(analyzerResultsRes).toBeDefined();
  });

  it('should have init data', function () {
    expect(TestResultCtrl.analyzers).toBeDefined();
    expect(TestResultCtrl.analyzerResults).toBeDefined();
    expect(TestResultCtrl.search).toBeDefined();
    expect(TestResultCtrl.selectAll).toEqual(false);
    expect(TestResultCtrl.autoInsert).toEqual(false);
    expect(TestResultCtrl.currentPage).toEqual(1);
    expect(TestResultCtrl.totalItems).toEqual(0);
    expect(TestResultCtrl.dateOptions).toBeDefined();
  });

  it('getAnalyzers function should return data', function () {
    TestResultCtrl.getAnalyzers()
    .then(function (result) {
      expect(result.length).toEqual(analyzerResMock.length);
    });
    http.flush();
  });

  it('getAnalyzerResults function should return data when load page', function () {
    TestResultCtrl.getAnalyzerResults()
    .then(function (result) {
      expect(result.totalAnalyzerResult).toEqual(responseMock.totalAnalyzerResult);
    });
    http.flush();
  });

  it('getAnalyzerResults function should return data with analyzerId', function () {
    http.whenGET('api/test-results?analyzer=571ed78e426cb3e01edba00f&limit=50&page=1&receivedDate='
      + TestResultCtrl.timestamp).respond(200, responseMock);
    TestResultCtrl.search.analyzer = { '_id': '571ed78e426cb3e01edba00f'};
    TestResultCtrl.getAnalyzerResults()
    .then(function (result) {
      expect(result.totalAnalyzerResult).toEqual(responseMock.totalAnalyzerResult);
    });
    http.flush();
  });

  it('getAnalyzerResults function should return totalItems with TRANSFERRED status', function () {
    http.whenGET('api/test-results?limit=50&page=1&receivedDate='
      + TestResultCtrl.timestamp + '&status=TRANSFERRED').respond(200,responseMock);
    TestResultCtrl.search.status = 'TRANSFERRED';
    TestResultCtrl.getAnalyzerResults(TestResultCtrl.search.status)
    .then(function (result) {
      expect(result.totalAnalyzerResult).toEqual(responseMock.totalAnalyzerResult);
    });
    http.flush();
  });

  it('getAnalyzerResults function should return totalItems with NEW status', function () {
    http.whenGET('api/test-results?limit=50&page=1&receivedDate='
      + TestResultCtrl.timestamp + '&status=NEW').respond(200,responseMock);
    TestResultCtrl.search.status = 'NEW';
    TestResultCtrl.getAnalyzerResults(TestResultCtrl.search.status)
    .then(function (result) {
      expect(result.totalAnalyzerResult).toEqual(responseMock.totalAnalyzerResult);
    });
    http.flush();
  });

  it('getAnalyzerResults function should return data with analyzerId and TRANSFERRED status', function () {
    http.whenGET('api/test-results?analyzer=571ed78e426cb3e01edba00f&limit=50&page=1&receivedDate='
      + TestResultCtrl.timestamp + '&status=TRANSFERRED').respond(200, responseMock);
    TestResultCtrl.search.analyzer = { '_id': '571ed78e426cb3e01edba00f'};
    TestResultCtrl.search.status = 'TRANSFERRED';
    TestResultCtrl.getAnalyzerResults(TestResultCtrl.search.status)
    .then(function (result) {
      expect(result.totalAnalyzerResult).toEqual(responseMock.totalAnalyzerResult);
    });
    http.flush();
  });

  it('getAnalyzerResults function should return totalItems with timestamp', function () {
    http.whenGET('api/test-results?limit=50&page=1&receivedDate=1464063218058').respond(200,responseMock);
    TestResultCtrl.timestamp = '1464063218058';

    TestResultCtrl.getAnalyzerResults()
    .then(function (result) {
      expect(result.totalAnalyzerResult).toEqual(responseMock.totalAnalyzerResult);
    });
    http.flush();
  });

  it('getAnalyzerResults function should return totalItems wit accessionNumber', function () {
    http.whenGET('api/test-results?accessionNumber=1670000024&limit=50&page=1&receivedDate=' +
      TestResultCtrl.timestamp).respond(200,responseMock);
    TestResultCtrl.search.accessionNumber = '1670000024';

    TestResultCtrl.getAnalyzerResults()
    .then(function (result) {
      expect(result.totalAnalyzerResult).toEqual(responseMock.totalAnalyzerResult);
    });
    http.flush();
  });

  it('getAnalyzerResults function should return data with analyzerId, status, timestamp, accessionNumber', function () {
    http.whenGET('api/test-results?accessionNumber=1670000024&analyzer=571ed78e426cb3e01edba00f&limit=50&page=1&receivedDate=1464153393075&status=TRANSFERRED')
      .respond(200, responseMock);
    TestResultCtrl.search.analyzer = { '_id': '571ed78e426cb3e01edba00f'};
    TestResultCtrl.search.status = 'TRANSFERRED';
    TestResultCtrl.search.accessionNumber = '1670000024';
    TestResultCtrl.timestamp = '1464153393075';
    TestResultCtrl.getAnalyzerResults(TestResultCtrl.search.status)
    .then(function (result) {
      expect(result.totalAnalyzerResult).toEqual(responseMock.totalAnalyzerResult);
    });
    http.flush();
  });


});
