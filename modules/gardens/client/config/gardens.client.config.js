(function () {
  'use strict';

  angular
    .module('gardens')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Gardens',
      state: 'gardens',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'List Gardens',
      state: 'gardens.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'Create Garden',
      state: 'gardens.create',
      roles: ['user']
    });
  }
})();
