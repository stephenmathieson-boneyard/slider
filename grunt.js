/*jslint node:true*/

module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-jslint');

	grunt.initConfig({
		watch: {
			files: '<config:jslint.files>',
			tasks: 'jslint'
		},

		server: {
			port: 9876,
			base: '.'
		},

		concat: {
			dist: {
				src: [
					'src/stubs/intro.js',

					'src/support.js',
					'src/common.js',
					'src/animation.js',
					'src/slider.js',

					'src/stubs/outro.js'
				],

				dest: 'dist/slider.js'
			}
		},

		min: {
			dist: {
				src: 'dist/slider.js',
				dest: 'dist/slider.min.js'
			}
		},

		qunit: {
		},

		jslint: {
			files: [
				'grunt.js',
				'src/*.js'
			],
			directives: {
				browser: true,
				unparam: true,
				todo: true
			}
		}

	});

};
