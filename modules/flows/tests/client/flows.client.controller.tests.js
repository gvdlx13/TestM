(function () {
  'use strict';

  describe('Flows Controller Tests', function () {
    // Initialize global variables
    var FlowsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      FlowsService,
      mockFlow;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _FlowsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      FlowsService = _FlowsService_;

      // create mock Flow
      mockFlow = new FlowsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Flow Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Flows controller.
      FlowsController = $controller('FlowsController as vm', {
        $scope: $scope,
        flowResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleFlowPostData;

      beforeEach(function () {
        // Create a sample Flow object
        sampleFlowPostData = new FlowsService({
          name: 'Flow Name'
        });

        $scope.vm.flow = sampleFlowPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (FlowsService) {
        // Set POST response
        $httpBackend.expectPOST('api/flows', sampleFlowPostData).respond(mockFlow);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Flow was created
        expect($state.go).toHaveBeenCalledWith('flows.view', {
          flowId: mockFlow._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/flows', sampleFlowPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Flow in $scope
        $scope.vm.flow = mockFlow;
      });

      it('should update a valid Flow', inject(function (FlowsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/flows\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('flows.view', {
          flowId: mockFlow._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (FlowsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/flows\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Flows
        $scope.vm.flow = mockFlow;
      });

      it('should delete the Flow and redirect to Flows', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/flows\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('flows.list');
      });

      it('should should not delete the Flow and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
