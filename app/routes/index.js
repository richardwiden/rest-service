'use strict';
let fs = require('fs');

module.exports = function (server, authorize) {
    fs.readdirSync('./routes').forEach(function (file) {
        if (file.substr(-3, 3) === '.js' && file !== 'index.js' && file !== 'auth.js') {
            require('./' + file.replace('.js', ''))(server, authorize);
        }
    });
};