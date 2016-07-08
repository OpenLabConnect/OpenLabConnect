'use strict';

describe('Controller: LatestTestCtrl', function () {

  beforeEach(module('openAim'));

  var LatestTestCtrl,
    TestRes,
    http,
    scope,
    lastestTestResMock = {
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
    };

  beforeEach(inject(function ($controller, $rootScope, testRes, $httpBackend) {
    scope = $rootScope.$new();
    TestRes = testRes;
    http = $httpBackend;
    http.whenGET('views/analyzer/analyzer.html').respond(200);
    http.whenGET('views/login/login.html').respond(200);
    http.whenGET('api/tests?latest=false&limit=20&page=1').respond(200, lastestTestResMock);
    LatestTestCtrl = $controller('LatestTestCtrl', {
      $scope: scope
    });
  }));

  it('should have a LatestTestCtrl controller', function () {
    expect(LatestTestCtrl).toBeDefined();
  });

  it('should have a testRes service', function () {
    expect(TestRes).toBeDefined();
  });

  it('should have a init data', function () {
    expect(LatestTestCtrl.tests).toBeDefined();
    expect(LatestTestCtrl.currentPage).toEqual(1);
    expect(LatestTestCtrl.totalItems).toEqual(0);
  });

  it('getLatestTest funciton should return data', function () {
    LatestTestCtrl.getLatestTest(false)
    .then(function (result) {
      expect(result.totalTestResult).toEqual(lastestTestResMock.totalTestResult);
    });
    http.flush();
    // http.flush() force the test runner to wait before the promise is completed
  });

  it('getLatestTest funciton should return true on pageChanged function', function () {
    LatestTestCtrl.currentPage = 2;
    LatestTestCtrl.limit = 20;
    http.whenGET('api/tests?latest=false&limit=20&page=2').respond(200, lastestTestResMock);
    LatestTestCtrl.getLatestTest(false)
    .then(function (result) {
      expect(result.totalTestResult).toEqual(lastestTestResMock.totalTestResult);
    });
    http.flush();
    // http.flush() force the test runner to wait before the promise is completed
  });

  it('getLatestTest funciton should return true on onGetLatest function', function () {
    LatestTestCtrl.currentPage = 1;
    LatestTestCtrl.limit = 20;
    http.whenGET('api/tests?latest=true&limit=20&page=1').respond(200, lastestTestResMock);
    LatestTestCtrl.getLatestTest(true)
    .then(function (result) {
      expect(result.totalTestResult).toEqual(lastestTestResMock.totalTestResult);
    });
    http.flush();
    // http.flush() force the test runner to wait before the promise is completed
  });
});
