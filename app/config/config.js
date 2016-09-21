'use strict';
let config = require('config');

let appConf = {};
appConf.name = config.get('app.name');
appConf.port = config.get('app.port');
appConf.admin = config.get('app.admin');

appConf.db = {};
appConf.db.host = config.get('app.db.host');
appConf.db.port = config.get('app.db.port');
appConf.db.name = config.get('app.db.name');
appConf.db.uri = 'mongodb://' + appConf.db.host + ':' + appConf.db.port + '/' + appConf.db.name;

appConf.log = {};
appConf.log.name = config.get('app.log.name');
appConf.log.level = config.get('app.log.level');

appConf.auth = {};
if (config.has('app.auth.google.id')) {
    appConf.auth.google = {};
    appConf.auth.google.id = config.get('app.auth.google.id');
    if (!process.env.AUTH_GOOGLE) throw "Missing AUTH_GOOGLE";
    appConf.auth.google.secret = process.env.AUTH_GOOGLE;
}

module.exports = appConf;