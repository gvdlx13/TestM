'use strict';

/**
 * Module dependencies
 */
var gardensPolicy = require('../policies/gardens.server.policy'),
  gardens = require('../controllers/gardens.server.controller');

module.exports = function(app) {
  // Gardens Routes
  app.route('/api/gardens').all(gardensPolicy.isAllowed)
    .get(gardens.list)
    .post(gardens.create);

  app.route('/api/gardens/:gardenId').all(gardensPolicy.isAllowed)
    .get(gardens.read)
    .put(gardens.update)
    .delete(gardens.delete);

  app.route('/api/gardens/:gardenId/test')
  .get(gardens.read);
  // Finish by binding the Garden middleware
  app.param('gardenId', gardens.gardenByID);
};
