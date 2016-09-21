'use strict';

let bunyan = require('bunyan')
    , format = require('bunyan-format')({outputMode: 'short', levelInString: true})
    , config = require('../config/config');

//noinspection JSCheckFunctionSignatures
let log = bunyan.createLogger({
    name: config.log.name,
    level: config.log.level,
    stream: format
});

//yak-shaving for intellij. Must be a better way to do this?
//noinspection SillyAssignmentJS
log.trace = log.trace; //noinspection SillyAssignmentJS
log.debug = log.debug; //noinspection SillyAssignmentJS
log.info = log.info; //noinspection SillyAssignmentJS
log.warn = log.warn; //noinspection SillyAssignmentJS
log.error = log.error; //noinspection SillyAssignmentJS
log.fatal = log.fatal; //noinspection SillyAssignmentJS
log.child = log.child;

module.exports = log;