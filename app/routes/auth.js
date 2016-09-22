'use strict';

let User = require('../models/user')
    , restify = require('restify')
    , fs = require('fs')
    , errors = require('../lib/errors')
    , config = require('../config/config')
    , firebase = require('firebase');

let logAndNext = function (err, message, req, res, next) {
    req.log.error(err, message);
    next();
};

let handleAuthorizationError = function (err, message, res, next) {
    res.send(new errors.UnauthorizedError(message));
    next(err);
};

let handleForbiddenError = function (err, message, res, next) {
    res.send(new errors.ForbiddenError(message));
    next(err);
};

let verifyAndAppendUser = function (req, res, next) {
    firebase.auth().verifyIdToken(idToken).then(function (decodedToken) {
        let uid = decodedToken.uid;

        User.findOne({uid: uid}, function (err, user) {
            if (err) return handleAuthorizationError(err, 'Could not find user');
            if (user) {
                req.user = user;
                return next();
            }
            let email = decodedToken.email;
            User.create({uid: uid, email: email}, function (err, user) {
                if (err) return handleAuthorizationError(err, 'Could not create user', res, next);
                req.user = user;
                next();
            })
        });
    }).catch(function (err) {
        handleAuthorizationError(err, 'Could not verify token', res, next);
    });
};

let authorizeUser = function (req, res, next) {
    if (!req.user) return handleForbiddenError('NotLoggedIn', 'Please login before accessing this route', res, next);
    next();
};

let authorizeAdmin = function (req, res, next) {
    if (!req.user || !req.user.admin) return handleForbiddenError('NotLoggedIn', 'Please login before accessing this route', res, next);
    next();
};

let respondLoginpage = function (req, res, next) {
    fs.readFile('views/login.html', function (err, data) {
        if (err)return next(err);
        res.end(data);
        next();
    });
};

let respondFile = function (name, type) {
    let contentType;
    switch (type) {
        case 'css':
            contentType = 'text/css';
            break;
        case 'js':
            contentType = 'application/javascript';
            break;
        default:
            contentType = 'text/plain';
    }
    return function (req, res, next) {
        fs.readFile('views/' + filename + '.' + type, function (err, data) {
            if (err) return next(err);
            res.header('Content-Type', contentType);
            res.end(data);
            next();
        });
    };
};


function setupRoutes(server) {
    server.get('/', respondFile('index.html'));
    server.get('/app.js', respondFile('app.js'));
    server.get('/style.css', respondFile('style.css'));
}

module.exports = {
    setupRoutes: setupRoutes,
    verifyAndAppendUser:verifyAndAppendUser,
    authorizer: {
        user: authorizeUser,
        admin: authorizeAdmin
    }
};