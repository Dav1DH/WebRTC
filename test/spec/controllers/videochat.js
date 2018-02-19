'use strict';

describe('Controller: VideochatCtrl', function () {

  // load the controller's module
  beforeEach(module('webRtcApp'));

  var VideochatCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideochatCtrl = $controller('VideochatCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VideochatCtrl.awesomeThings.length).toBe(3);
  });
});
