'use strict';

let User = require('../models/user'),
    restify = require('restify'),
    fs = require('fs'),
    errors = require('../lib/errors'),
    config = require('../config/config'),
    verifier = require('google-id-token-verifier');

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
    if (!req || !req.headers || !req.headers['x-access-token']) return next();
    let token = req.headers['x-access-token'];
    if (!token) return next(); // No token sent by user
    verifier.verify(token, config.auth.google.id, function (err, tokenInfo) {
        if (err) return logAndNext(err, 'token verify failed', req, res, next);
        User.findJwtUserByEmail(tokenInfo.email, function (err, user) {
            if (err) return logAndNext(err, 'Could not retrieve user', req, res, next);
            req.user = user;
            next();
        })
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

/**
 * https://developers.google.com/identity/sign-in/web/backend-auth
 * @param req
 * @param res
 * @param next
 */
let checkGoogleTokenAndAddUserToReq = function (req, res, next) {
    let signSaveAndRespond = function (err, user) {
        if (err) return handleAuthorizationError(err, "Could not retrieve from database", res, next);
        if (user == null) return handleAuthorizationError("UserNotCreated", "Could not retrieve from database", res, next);
        req.user = user;
        res.send(user);
        next();
    };
    verifier.verify(req.body, config.auth.google.id, function (err, tokenInfo) {
        if (err) return handleAuthorizationError(err, "Unable to verify token", res, next);
        User.findJwtUserByEmail(tokenInfo.email, function (err, user) {
            if (err) return handleAuthorizationError(err, "Could not find user", req, next);
            if (user == null) return User.createUser(tokenInfo.email, function (err, user) {
                if (err)return handleAuthorizationError(err, "Could not create user", req, next);
                User.findJwtUserByEmail(tokenInfo.email, function (err, user) {
                    if (err) return handleAuthorizationError(err, "Could not find user after creation", res, next);
                    signSaveAndRespond(null, user)
                });
            });
            signSaveAndRespond(null, user);
        });
    });
};

function setupRoutes(server) {
    server.get('/', respondLoginpage);
    server.post('/auth/token/google', checkGoogleTokenAndAddUserToReq);
}

module.exports = {
    setupRoutes: setupRoutes,
    verifyAndAppendUser: verifyAndAppendUser,
    authorizer: {
        user: authorizeUser,
        admin: authorizeAdmin
    }
};