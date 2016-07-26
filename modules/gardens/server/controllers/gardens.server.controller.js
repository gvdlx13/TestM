'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Garden = mongoose.model('Garden'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Garden
 */
exports.create = function(req, res) {
  var garden = new Garden(req.body);
  garden.user = req.user;

  garden.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(garden);
    }
  });
};

/**
 * Show the current Garden
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var garden = req.garden ? req.garden.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  garden.isCurrentUserOwner = req.user && garden.user && garden.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(garden);
};

/**
 * Update a Garden
 */
exports.update = function(req, res) {
  var garden = req.garden ;

  garden = _.extend(garden , req.body);

  garden.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(garden);
    }
  });
};

/**
 * Delete an Garden
 */
exports.delete = function(req, res) {
  var garden = req.garden ;

  garden.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(garden);
    }
  });
};

/**
 * List of Gardens
 */
exports.list = function(req, res) {
  Garden.find().sort('-created').populate('user', 'displayName').exec(function(err, gardens) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gardens);
    }
  });
};

/**
 * Garden middleware
 */
exports.gardenByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Garden is invalid'
    });
  }

  Garden.findById(id).populate('user', 'displayName').exec(function (err, garden) {
    if (err) {
      return next(err);
    } else if (!garden) {
      return res.status(404).send({
        message: 'No Garden with that identifier has been found'
      });
    }
    req.garden = garden;
    next();
  });
};
