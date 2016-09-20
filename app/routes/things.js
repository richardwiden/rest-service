'use strict';

//TODO read from db
module.exports = function (server, authorizer) {
    let Thing = require('../models/thing');
    server.get('/things', authorizer.user, listThings);
    server.post('things', authorizer.user, listThings);
    function listThings(req, res, next) {
        res.send('hello ' + req.params.name);
        next();
    }
};