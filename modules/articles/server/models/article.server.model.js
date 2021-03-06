'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var testSubSchema = new Schema({

  reading:{
    type: Number,
    default: 0,
    required: 'Must have a Reading'
  },
  recorded: {
    type: Date,
    default: Date.now
  }
});


var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  info: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  number: {
    type: Number,
    default: 0,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  reader: [testSubSchema]
});

mongoose.model('Article', ArticleSchema);
