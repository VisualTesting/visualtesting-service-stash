'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    path_validator: {
      js: {
        src: [
          '**/*[A-Z]*.js',
          '!node_modules/**/*.js',
          '!Gruntfile.js'
        ]
      }
    },

    jscs: {
      files: {
        src: [
          '**/*.js',
          '!node_modules/**'
        ]
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      files: {
        src: [
          '**/*.js',
          '!node_modules/**'
        ]
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('style', ['path_validator', 'jshint', 'jscs']);
};
