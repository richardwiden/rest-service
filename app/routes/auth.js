'use strict';

var User = require('../models/user'),
    restify = require('restify'),
    fs = require('fs'),
    errors = require('restify-errors'),
    config = require('../config/config'),
    verifier = require('google-id-token-verifier');

var logAndNext = function (err, message, req, res, next) {
    req.log.error(err, message);
    next();
};
function verifyAndAppendUser(req, res, next) {
    if (!req || !req.headers || !req.headers['x-access-token']) return next();
    var token = req.headers['x-access-token'];
    if (!token) return next(); // No token sent by user
    verifier.verify(token, config.auth.google.id, function (err, tokenInfo) {
        if (err) return logAndNext(err, 'token verify failed', req, res, next);
        User.findJwtUserByEmail(tokenInfo.email, function (err, user) {
            if (err) return logAndNext(err, 'Could not retrieve user', req, res, next);
            req.user = user;
            next();
        })
    });
}

function setupRoutes(server) {
    server.get('/', respondLoginpage);
    server.post('/auth/token/google', checkGoogleTokenAndAddUserToReq);


    //noinspection JSUnusedLocalSymbols
    function respondLoginpage(req, res, next) {
        fs.readFile('views/login.html', function (err, data) {
            if (err)return next(err);
            res.end(data);
            next();
        });
    }

    function handleError(err, message, res, next) {
        res.send(new errors.UnauthorizedError(message));
        next(err);
    }


    /**
     * https://developers.google.com/identity/sign-in/web/backend-auth
     * @param req
     * @param res
     * @param next
     */
    function checkGoogleTokenAndAddUserToReq(req, res, next) {
        var signSaveAndRespond = function (err, user) {
            if (err) return handleError(err, "Could not retrieve from database", req, next);
            if (user == null) return handleError("UserNotCreated", "Could not retrieve from database", req, next);
            req.user = user;
            res.send(user);
            next();
        };
        verifier.verify(req.body, config.auth.google.id, function (err, tokenInfo) {
            if (err) return handleError(err, "Unable to verify token", res, next);
            User.findJwtUserByEmail(tokenInfo.email, function (err, user) {
                if (err) return handleError(err, "Could not find user", req, next);
                if (user == null) return User.create({email: tokenInfo.email}, function (err, user) {
                    if (err)return handleError(err, "Could not create user", req, next);
                    User.findJwtUserByEmail(tokenInfo.email, function (err, user) {
                        if (err) return handleError(err, "Could not find user after creation", req, next);
                        signSaveAndRespond(null, user)
                    });
                });
                signSaveAndRespond(null, user);
            });
        });
        /*client.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body, function (data, response) {
         if (response.statusCode != 200 || !data.email_verified || !data.email ||
         data.aud != config.auth.google.id) return res.send(new errors.UnauthorizedError());
         User.findOne({email: data.email}, {email: 1}, function (err, user) {
         if (err)  return res.send(new errors.UnauthorizedError());
         jwt.sign(user, config.auth.jwt);
         next();
         });
         });*/
    }
}

module.exports = {
    setupRoutes: setupRoutes,
    verifyAndAppendUser: verifyAndAppendUser
};