'use strict';

describe('Controller: LoginCtrl', function () {

  beforeEach(module('openAim'));

  var LoginCtrl,
    http,
    $location,
    $cookieStore,
    responseMock = {
      data: {
      "user": {
        "_id": "5716e731cb7975041595b3b6",
        "email": "test@test.com",
        "__v": 0
      },
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzE2ZTczMWNiNzk3NTA0MTU5NWIzYjYiLCJpYXQiOjE0NjQxNjU4MTQsImV4cCI6MTQ2NDE4MzgxNH0.kTL_4iy4E-v6IuqYXvq5eImLEAhPkSJJH4OcQvuBszw"
    }
  };

  beforeEach(inject(function ($controller, _$httpBackend_, _$location_, _$cookieStore_) {
    LoginCtrl = $controller('LoginCtrl', {});
    http = _$httpBackend_;
    http.whenGET('views/analyzer/analyzer.html').respond(200);
    http.whenGET('views/login/login.html').respond(200);
    http.whenGET('/api/users/me');
    http.whenPOST('/auth/local').respond(200, responseMock.data);
    $cookieStore = _$cookieStore_;
    $location = _$location_;
  }));

  afterEach(function () {
    http.verifyNoOutstandingExpectation();
    http.verifyNoOutstandingRequest();
    $cookieStore.remove('token');
  });

  it('should redirect to /analyzer after successful login', function () {
    console.log(responseMock.data.user);
    LoginCtrl.login();
    http.flush();
    expect($location.path()).toBe('/analyzer');
  });

});
