(function () {
  'use strict';

  angular
    .module('flows')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('flows', {
        abstract: true,
        url: '/flows',
        template: '<ui-view/>'
      })
      .state('flows.list', {
        url: '',
        templateUrl: 'modules/flows/client/views/list-flows.client.view.html',
        controller: 'FlowsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Flows List'
        }
      })
      .state('flows.create', {
        url: '/create',
        templateUrl: 'modules/flows/client/views/form-flow.client.view.html',
        controller: 'FlowsController',
        controllerAs: 'vm',
        resolve: {
          flowResolve: newFlow
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Flows Create'
        }
      })
      .state('flows.edit', {
        url: '/:flowId/edit',
        templateUrl: 'modules/flows/client/views/form-flow.client.view.html',
        controller: 'FlowsController',
        controllerAs: 'vm',
        resolve: {
          flowResolve: getFlow
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Flow {{ flowResolve.name }}'
        }
      })
      .state('flows.view', {
        url: '/:flowId',
        templateUrl: 'modules/flows/client/views/view-flow.client.view.html',
        controller: 'FlowsController',
        controllerAs: 'vm',
        resolve: {
          flowResolve: getFlow
        },
        data:{
          pageTitle: 'Flow {{ articleResolve.name }}'
        }
      });
  }

  getFlow.$inject = ['$stateParams', 'FlowsService'];

  function getFlow($stateParams, FlowsService) {
    return FlowsService.get({
      flowId: $stateParams.flowId
    }).$promise;
  }

  newFlow.$inject = ['FlowsService'];

  function newFlow(FlowsService) {
    return new FlowsService();
  }
})();
