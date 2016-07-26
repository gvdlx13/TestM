(function () {
  'use strict';

  // Flows controller
  angular
    .module('flows')
    .controller('FlowsController', FlowsController);

  FlowsController.$inject = ['$scope', '$state', 'Authentication', 'flowResolve'];

  function FlowsController ($scope, $state, Authentication, flow) {
    var vm = this;

    vm.authentication = Authentication;
    vm.flow = flow;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Flow
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.flow.$remove($state.go('flows.list'));
      }
    }

    // Save Flow
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.flowForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.flow._id) {
        vm.flow.$update(successCallback, errorCallback);
      } else {
        vm.flow.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('flows.view', {
          flowId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
