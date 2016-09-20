'use strict';

//TODO read from db
module.exports = function (server, authorize) {
    var Thing = require('../models/thing');

    server.get('/things', authorize, listThings);
    server.post('things', listThings);
    function listThings(req, res, next) {
        res.send('hello ' + req.params.name);
        next();
    }
};