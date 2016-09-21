'use strict';

//http://techblog.troyweb.com/index.php/2014/05/using-grunt-to-auto-restart-node-js-with-file-watchers/

module.exports = function(grunt) {
    //noinspection JSUnusedGlobalSymbols
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: true, // Optionally clear the require cache before running tests (defaults to false)
                    noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
                },
                src: ['tests/**/*.js']
            }
        },
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
            },
        },

        watch: {
            scripts: {
                files: ["server.js","routes/*.js","config/*.js","lib/*.js","tests/**/*.js"],
                tasks: ["mochaTest:test"],
                options: {
                    spawn: false,
                },
            },
        },
    });

    grunt.loadNpmTasks("grunt-nodemon");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("run", ["concurrent:dev"]);
    grunt.registerTask("default", ["mochaTest","watch"]);
    grunt.registerTask('test', ['mochaTest']);
};