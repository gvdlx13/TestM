//Flows service used to communicate Flows REST endpoints
(function () {
  'use strict';

  angular
    .module('flows')
    .factory('FlowsService', FlowsService);

  FlowsService.$inject = ['$resource'];

  function FlowsService($resource) {
    return $resource('api/flows/:flowId', {
      flowId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
