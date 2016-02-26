module.exports = function(grunt) {

    grunt.initConfig({

        // JS TASKS ================================================================
        jshint: {
            all: ['public/js/**/*.js']
        },

        uglify: {
            build: {
                files: {
                    'public/dist/js/app.min.js': ['public/js/**/*.js', 'public/js/*.js']
                }
            }
        },

        bower_concat: {
            all: {
                dest: 'public/dist/js/libs.js',
                cssDest: 'public/dist/css/libs.css',
                exclude: [
                    'angular'
                ]
            }
        },

        // CSS TASKS ===============================================================
        cssmin: {
            build: {
                files: {
                    'public/dist/css/style.min.css': 'public/css/style.css'
                }
            }
        },

        // COOL TASKS ==============================================================
        watch: {
            css: {
                files: ['public/css/**/*.less'],
                tasks: ['less', 'cssmin']
            },
            js: {
                files: ['public/js/**/*.js'],
                tasks: ['jshint', 'uglify']
            }
        },

        nodemon: {
            dev: {
                script: 'server.js'
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('libs', ['bower_concat']);
    grunt.registerTask('default', ['cssmin', 'jshint', 'uglify', 'concurrent']);

};
