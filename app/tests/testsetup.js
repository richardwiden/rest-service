'use strict';

let testsetup={};
testsetup.dbURI    = 'mongodb://localhost/demo-app-clearing-db';
testsetup.should   = require('chai').should();
testsetup.mongoose = require('mongoose');
testsetup.mongoose.Promise = require('bluebird');
testsetup.Thing    = require('../models/thing');
testsetup.clearDB  = require('mocha-mongoose')(testsetup.dbURI);

module.exports = testsetup;
