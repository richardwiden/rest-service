'use strict';
let mongoose = require('mongoose'),
    thing = new mongoose.Schema({name: {type:String,required:true}});

module.exports = mongoose.model("Thing", thing);
