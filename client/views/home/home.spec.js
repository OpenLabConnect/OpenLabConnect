'use strict';

describe('Controller: HomeCtrl', function () {

  beforeEach(module('openAim'));

  var HomeCtrl,
    scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomeCtrl = $controller('HomeCtrl', {
      $scope: scope
    });
  }));

  it('should have a HomeCtrl Controller', function () {
    expect(HomeCtrl).toBeDefined();
  });

});
