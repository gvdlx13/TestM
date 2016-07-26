'use strict';

/**
 * Module dependencies
 */
var flowsPolicy = require('../policies/flows.server.policy'),
  flows = require('../controllers/flows.server.controller');

module.exports = function(app) {
  // Flows Routes
  app.route('/api/flows').all(flowsPolicy.isAllowed)
    .get(flows.list)
    .post(flows.create);

  app.route('/api/flows/:flowId').all(flowsPolicy.isAllowed)
    .get(flows.read)
    .put(flows.update)
    .delete(flows.delete);

  // Finish by binding the Flow middleware
  app.param('flowId', flows.flowByID);
};
