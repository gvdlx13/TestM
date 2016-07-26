'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Flow Schema
 */
var FlowSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Flow name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Flow', FlowSchema);
