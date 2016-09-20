'use strict';
var mongoose = require('mongoose');
var thing = new mongoose.Schema({name: String});
module.exports = mongoose.model("Thing", thing);
