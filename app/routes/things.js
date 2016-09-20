'use strict';

let Thing = require('../models/thing'),
    errors = require('../lib/errors');
function listThings(req, res, next) {
    Thing.find({},function (err, things) {
        if(err) return next(err);
        res.json(things);
        next();
    });
}

function addThing(req,res,next) {
    Thing.create({name:req.body.name},function (err, thing) {
        if(err) {
            res.send(new errors.BadRequestError(err.message));
            return next(err);
        }
        res.send(thing);
        next();
    })
}



module.exports = function (server, authorizer) {
    server.get('/things', authorizer.user, listThings);
    server.post('/things', authorizer.user, addThing);
};