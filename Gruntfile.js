module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg:       grunt.file.readJSON('package.json'),
        babel:     {
            options: {
                sourceMap: false,
                stage:     0
            },
            dist:    {
                files: [
                    {
                        expand: true,
                        cwd:    'src',
                        src:    ['**/*.js'],
                        dest:   'dist/'
                    }
                ]
            }
        },
        browserify: {
            dist: {
                files:   {
                    'crate.js': ['dist/**/*.js']
                },
                options: {
                    transform: [["babelify", {"stage": ["0"]}]]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    './crate.min.js': ['./crate.js']
                }
            }
        },
        watch:     {
            js: {
                files: ['src/**/*.js', 'test/**/*.js'],
                tasks: ['default']
            }
        },
        mochaTest: {
            tests: {
                options: {
                    reporter: 'spec'
                },
                src:     ['test/**/*.js']
            }
        },
        focus:     {
            dev: {}
        }
    });

    grunt.registerTask('js', ['babel']);

    grunt.registerTask('default', ['js', 'mochaTest']);
    grunt.registerTask('dev', ['default', 'focus:dev']);
};