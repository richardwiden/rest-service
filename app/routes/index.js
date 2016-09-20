'use strict';
let fs = require('fs');

/**
 * Reads all routes in directory besides index.ks and auth.js
 * @param server server to use routes on
 * @param authorize object with functions for auth.user auth.admin
 */
module.exports = function (server, authorize) {
    fs.readdirSync('./routes').forEach(function (file) {
        if (file.substr(-3, 3) === '.js' && file !== 'index.js' && file !== 'auth.js') {
            require('./' + file.replace('.js', ''))(server, authorize);
        }
    });
};