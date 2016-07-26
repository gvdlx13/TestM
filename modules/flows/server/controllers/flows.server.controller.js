'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Flow = mongoose.model('Flow'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Flow
 */
exports.create = function(req, res) {
  var flow = new Flow(req.body);
  flow.user = req.user;

  flow.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(flow);
    }
  });
};

/**
 * Show the current Flow
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var flow = req.flow ? req.flow.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  flow.isCurrentUserOwner = req.user && flow.user && flow.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(flow);
};

/**
 * Update a Flow
 */
exports.update = function(req, res) {
  var flow = req.flow ;

  flow = _.extend(flow , req.body);

  flow.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(flow);
    }
  });
};

/**
 * Delete an Flow
 */
exports.delete = function(req, res) {
  var flow = req.flow ;

  flow.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(flow);
    }
  });
};

/**
 * List of Flows
 */
exports.list = function(req, res) { 
  Flow.find().sort('-created').populate('user', 'displayName').exec(function(err, flows) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(flows);
    }
  });
};

/**
 * Flow middleware
 */
exports.flowByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Flow is invalid'
    });
  }

  Flow.findById(id).populate('user', 'displayName').exec(function (err, flow) {
    if (err) {
      return next(err);
    } else if (!flow) {
      return res.status(404).send({
        message: 'No Flow with that identifier has been found'
      });
    }
    req.flow = flow;
    next();
  });
};
