'use strict';

describe('Service: Auth', function () {

  beforeEach(module('openAim'));

  var Auth,
    $httpBackend,
    $cookieStore;

  beforeEach(inject(function (_Auth_, _$httpBackend_, _$cookieStore_) {
    Auth = _Auth_;
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('views/analyzer/analyzer.html').respond(200);
    $httpBackend.whenGET('views/login/login.html').respond(200);
    $cookieStore = _$cookieStore_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $cookieStore.remove('token');
  });

  it('should log user', function () {
    expect(Auth.isLogged()).toBe(false);
    Auth.login({ _id: '123', email: 'test@test.com', password: 'test' });
    $httpBackend.expectPOST('/auth/local')
      .respond({ token: 'abcde', user: { _id: '123', email: 'test@test.com' } });
    $httpBackend.flush();
    expect($cookieStore.get('token')).toBe('abcde');
    expect(Auth.getUser().email).toBe('test@test.com');
    expect(Auth.getUser()._id).toBe('123');
    expect(Auth.isLogged()).toBe(true);
  });

  it('logout should remove token and user should equal {}', function () {
    expect(Auth.isLogged()).toBe(false);
    Auth.login({ _id: '123', email: 'test@test.com', password: 'test' });
    $httpBackend.expectPOST('/auth/local')
      .respond({ token: 'abcde', user: { _id: '123', email: 'test@test.com' } });
    $httpBackend.flush();
    Auth.logout();
    expect($cookieStore.get('token')).toBeUndefined();
    expect(Auth.getUser()).toEqual({});
  });

  it('isLogged should return true after login', function () {
    expect(Auth.isLogged()).toBe(false);
    Auth.login({ _id: '123', email: 'test@test.com', password: 'test' });
    $httpBackend.expectPOST('/auth/local')
      .respond({ token: 'abcde', user: { _id: '123', email: 'test@test.com' } });
    $httpBackend.flush();
    expect(Auth.isLogged()).toEqual(true);
  });

  it('isLogged should return false after log out', function () {
    expect(Auth.isLogged()).toBe(false);
    Auth.login({ _id: '123', email: 'test@test.com', password: 'test' });
    $httpBackend.expectPOST('/auth/local')
      .respond({ token: 'abcde', user: { _id: '123', email: 'test@test.com' } });
    $httpBackend.flush();
    Auth.logout();
    expect(Auth.isLogged()).toBe(false);
  });

});
