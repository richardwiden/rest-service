'use strict';

var restify = require('restify'),
    mongoose = require('./lib/mongoose'),
    config = require('./config/config'),
    debug = require('debug')(config.name),
    log = require('./lib/log'),
    format = require('bunyan-format')({outputMode:'short',levelInString:true}),
    server = restify.createServer({
        name: config.name,
        version: '1.0.0',
        log:log,
    });




//server.on('after', restify.auditLogger({body:false,log: log.child({level:'info',request:'audit',stream:format})}));
server.pre(function (req, res, next) {
    req.log.info({ url: req.url }, req.method);
    next();
});
server.use(restify.requestLogger());
server.use(restify.bodyParser());
server.use();
var auth = require('./routes/auth');
server.use(auth.verifyAndAppendUser);
auth.setupRoutes(server);
var routes = require('./routes/')(server);


mongoose.connect(config.db.uri, function (err,info) {
    if(err) return log.error(err);
    log.info(info);
    server.listen(config.port, function (err) {
        if (err) return debug(err);
        log.info("%s listening at %s", config.name, config.port);
    })
});
