'use strict';

let config = require('../config/config')
    , fs = require('fs')
    , mongoose = require('../lib/mongoose');


let createSomething = function (className, defaultData, cb) {
    let MyClass = require('../models/' + className.toLocaleLowerCase());
    console.log("Writing: " + className);
    let myClass = new MyClass(defaultData);
    myClass.save(function (err, thing) {
        console.log("Saved: " + className);
        if (err) return cb(err);
        let thingObj = JSON.stringify(thing.toObject());
        thing.remove(function () {
            if (err) return cb(err);
            let filename = '../rest-pojo/test/' + className + '.json';
            console.log("Writing: " + filename);
            fs.writeFile(filename, thingObj, {flag: 'w+'}, function (err) {
                if (err) return cb(err);
                cb();
            })
        });
    })
};

mongoose.connect(config.db.uri, function (err, info) {
    createSomething('Thing', {name: "name"}, function (err) {
        if (err) {
            mongoose.connection.close();
            throw err;
        }
        console.log("Thing written");
        mongoose.connection.close();
    });
});

