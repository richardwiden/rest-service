'use strict';
let config = require('config');

let appConf = {};
appConf.name = config.get('app.name');
appConf.port = config.get('app.port');
appConf.admin = config.get('app.admin');

appConf.db = {};
appConf.db.host = process.env.DB_HOST ? process.env.DB_HOST : config.get('app.db.host');
appConf.db.port = process.env.DB_PORT ? process.env.DB_PORT : config.get('app.db.port');
appConf.db.name = process.env.DB_NAME ? process.env.DB_NAME : config.get('app.db.name');
appConf.db.uri = 'mongodb://admin:password@' + appConf.db.host + ':' + appConf.db.port + '/' + appConf.db.name;

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