//Gardens service used to communicate Gardens REST endpoints
(function () {
  'use strict';

  angular
    .module('gardens')
    .factory('GardensService', GardensService);

  GardensService.$inject = ['$resource'];

  function GardensService($resource) {
    return $resource('api/gardens/:gardenId', {
      gardenId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
