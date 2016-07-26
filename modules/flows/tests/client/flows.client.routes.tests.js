(function () {
  'use strict';

  describe('Flows Route Tests', function () {
    // Initialize global variables
    var $scope,
      FlowsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FlowsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FlowsService = _FlowsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('flows');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/flows');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FlowsController,
          mockFlow;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('flows.view');
          $templateCache.put('modules/flows/client/views/view-flow.client.view.html', '');

          // create mock Flow
          mockFlow = new FlowsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Flow Name'
          });

          //Initialize Controller
          FlowsController = $controller('FlowsController as vm', {
            $scope: $scope,
            flowResolve: mockFlow
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:flowId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.flowResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            flowId: 1
          })).toEqual('/flows/1');
        }));

        it('should attach an Flow to the controller scope', function () {
          expect($scope.vm.flow._id).toBe(mockFlow._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/flows/client/views/view-flow.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FlowsController,
          mockFlow;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('flows.create');
          $templateCache.put('modules/flows/client/views/form-flow.client.view.html', '');

          // create mock Flow
          mockFlow = new FlowsService();

          //Initialize Controller
          FlowsController = $controller('FlowsController as vm', {
            $scope: $scope,
            flowResolve: mockFlow
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.flowResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/flows/create');
        }));

        it('should attach an Flow to the controller scope', function () {
          expect($scope.vm.flow._id).toBe(mockFlow._id);
          expect($scope.vm.flow._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/flows/client/views/form-flow.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FlowsController,
          mockFlow;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('flows.edit');
          $templateCache.put('modules/flows/client/views/form-flow.client.view.html', '');

          // create mock Flow
          mockFlow = new FlowsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Flow Name'
          });

          //Initialize Controller
          FlowsController = $controller('FlowsController as vm', {
            $scope: $scope,
            flowResolve: mockFlow
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:flowId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.flowResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            flowId: 1
          })).toEqual('/flows/1/edit');
        }));

        it('should attach an Flow to the controller scope', function () {
          expect($scope.vm.flow._id).toBe(mockFlow._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/flows/client/views/form-flow.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
