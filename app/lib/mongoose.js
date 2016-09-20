'use strict';

let mongoose = require('mongoose'),
    config = require('../config/config'),
    debug = require('debug')(config.name);

mongoose.innerConnect = mongoose.connect;
mongoose.connect = function (uri, options, callback) {
    if (callback == null && options && typeof options === typeof (Function)) {
        callback = options;
        options = {};
    }

    if (typeof callback === typeof (Function))  mongoose.innerConnect(uri, options, function (err) {
        if (err) return callback(err);
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                callback('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
        mongoose.connection.on("error", function(err) {
            callback(err);
            process.exit(0);
        });


        mongoose.connection.on('disconnected', function () {
            callback(err);
            process.exit(0);
        });
        callback(null,'Mongoose connected:' + uri, config.name);
    });
    else
        mongoose.innerConnect(uri, options)
};

module.exports = mongoose;