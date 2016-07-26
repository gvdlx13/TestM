(function () {
  'use strict';

  describe('Gardens Route Tests', function () {
    // Initialize global variables
    var $scope,
      GardensService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _GardensService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      GardensService = _GardensService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('gardens');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/gardens');
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
          GardensController,
          mockGarden;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('gardens.view');
          $templateCache.put('modules/gardens/client/views/view-garden.client.view.html', '');

          // create mock Garden
          mockGarden = new GardensService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Garden Name'
          });

          //Initialize Controller
          GardensController = $controller('GardensController as vm', {
            $scope: $scope,
            gardenResolve: mockGarden
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:gardenId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.gardenResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            gardenId: 1
          })).toEqual('/gardens/1');
        }));

        it('should attach an Garden to the controller scope', function () {
          expect($scope.vm.garden._id).toBe(mockGarden._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/gardens/client/views/view-garden.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          GardensController,
          mockGarden;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('gardens.create');
          $templateCache.put('modules/gardens/client/views/form-garden.client.view.html', '');

          // create mock Garden
          mockGarden = new GardensService();

          //Initialize Controller
          GardensController = $controller('GardensController as vm', {
            $scope: $scope,
            gardenResolve: mockGarden
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.gardenResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/gardens/create');
        }));

        it('should attach an Garden to the controller scope', function () {
          expect($scope.vm.garden._id).toBe(mockGarden._id);
          expect($scope.vm.garden._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/gardens/client/views/form-garden.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          GardensController,
          mockGarden;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('gardens.edit');
          $templateCache.put('modules/gardens/client/views/form-garden.client.view.html', '');

          // create mock Garden
          mockGarden = new GardensService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Garden Name'
          });

          //Initialize Controller
          GardensController = $controller('GardensController as vm', {
            $scope: $scope,
            gardenResolve: mockGarden
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:gardenId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.gardenResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            gardenId: 1
          })).toEqual('/gardens/1/edit');
        }));

        it('should attach an Garden to the controller scope', function () {
          expect($scope.vm.garden._id).toBe(mockGarden._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/gardens/client/views/form-garden.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
