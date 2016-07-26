(function () {
  'use strict';

  angular
    .module('flows')
    .controller('FlowsListController', FlowsListController);

  FlowsListController.$inject = ['FlowsService'];

  function FlowsListController(FlowsService) {
    var vm = this;

    vm.flows = FlowsService.query();
  }
})();
