'use strict';

//http://techblog.troyweb.com/index.php/2014/05/using-grunt-to-auto-restart-node-js-with-file-watchers/

module.exports = function(grunt) {
    //noinspection JSUnusedGlobalSymbols
    grunt.initConfig({

        concurrent: {
            dev: ["nodemon"],
            options: {
                debug:true,
                logConcurrentOutput: true
            }
        },

        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    env: {NODE_ENV: "development"},
                    watch: ["server.js","routes/*.js","config/*.js","lib/*.js"],
                    delay: 300,

                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    }
                }
            }
        },
    });

    grunt.loadNpmTasks("grunt-nodemon");
    grunt.loadNpmTasks("grunt-concurrent");

    grunt.registerTask("run", ["concurrent:dev"]);
    grunt.registerTask("default", ["concurrent:dev"]);
};