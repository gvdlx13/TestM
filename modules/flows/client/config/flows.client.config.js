(function () {
  'use strict';

  angular
    .module('flows')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Flows',
      state: 'flows',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'flows', {
      title: 'List Flows',
      state: 'flows.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'flows', {
      title: 'Create Flow',
      state: 'flows.create',
      roles: ['user']
    });
  }
})();
