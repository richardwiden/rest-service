'use strict';
let mongoose = require('mongoose'),
    thing = new mongoose.Schema({name: String});

module.exports = mongoose.model("Thing", thing);
