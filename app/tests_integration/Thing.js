'use strict';

let mongoose =require('mongoose')
    ,Thing = require('../models/thing');

module.exports = function () {
    let thing = new Thing({name:"name"});
    console.log("thing");
    throw "test_exception"
};
