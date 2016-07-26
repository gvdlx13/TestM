(function () {
  'use strict';

  angular
    .module('gardens')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('gardens', {
        abstract: true,
        url: '/gardens',
        template: '<ui-view/>'
      })
      .state('gardens.list', {
        url: '',
        templateUrl: 'modules/gardens/client/views/list-gardens.client.view.html',
        controller: 'GardensListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Gardens List'
        }
      })
      .state('gardens.create', {
        url: '/create',
        templateUrl: 'modules/gardens/client/views/form-garden.client.view.html',
        controller: 'GardensController',
        controllerAs: 'vm',
        resolve: {
          gardenResolve: newGarden
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Gardens Create'
        }
      })
      .state('gardens.edit', {
        url: '/:gardenId/edit',
        templateUrl: 'modules/gardens/client/views/form-garden.client.view.html',
        controller: 'GardensController',
        controllerAs: 'vm',
        resolve: {
          gardenResolve: getGarden
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Garden {{ gardenResolve.name }}'
        }
      })
      .state('gardens.view', {
        url: '/:gardenId',
        templateUrl: 'modules/gardens/client/views/view-garden.client.view.html',
        controller: 'GardensController',
        controllerAs: 'vm',
        resolve: {
          gardenResolve: getGarden
        },
        data:{
          pageTitle: 'Garden {{ articleResolve.name }}'
        }
      });
  }

  getGarden.$inject = ['$stateParams', 'GardensService'];

  function getGarden($stateParams, GardensService) {
    return GardensService.get({
      gardenId: $stateParams.gardenId
    }).$promise;
  }

  newGarden.$inject = ['GardensService'];

  function newGarden(GardensService) {
    return new GardensService();
  }
})();
