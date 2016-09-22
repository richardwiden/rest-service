'use strict';
let mongoose = require('mongoose')
    , config = require('../config/config')
    , userSchema = new mongoose.Schema({email: String, uid: String});

let User = mongoose.model("User", userSchema);

module.exports = User;
