'use strict';

//TODO read from db
module.exports = function (server) {
    var Thing= require('../models/thing');
    server.get('/things', listThings);
    server.post('things', listThings);
    function listThings(req, res, next) {
        res.send('hello ' + req.params.name);
        next();
    }
};