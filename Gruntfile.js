'use strict()';
var browserifyFiles = [{
	expand: true,
	cwd: 'views/',
	src: ['**/client.js'],
	dest: 'public/javascript/',
	ext: '.js',
	rename: function(dest, src, params) {
		var srcArray = src.split('/');
		return dest + srcArray[0] + params.ext;
	}
}];

module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		concurrent: {
			dev: {
				tasks: ['nodemon', 'browserify:dev', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		browserify: {
      dev: {
        options: {
					browserifyOptions: {
		         debug: true
		      },
					watch: true,
					keepAlive: true
        },
        files: browserifyFiles,
      },
			build: {
        options: {
					browserifyOptions: {
		         debug: false
		      }
        },
				files: browserifyFiles
      }
    },

		nodemon: {
			debug: {
				script: './bin/www',
				options: {
					nodeArgs: ['--debug'],
					env: {
						port: 3000
					},
					ignore: ['node_modules/**', 'public/**', 'src/**', 'views/**/client.js', '**/*.scss']
				}
			}
		},

		sass: {
        options: {
            sourceMap: true,
						sourceMapContents: true
        },
        build: {
            files: [{
							expand: true,
							cwd: 'views/',
							src: ['**/*.scss'],
							dest: 'public/stylesheets/',
							ext: '.css',
							rename: function(dest, src, params) {
								var srcArray = src.split('/');
								return dest + srcArray[0] + params.ext;
							}
						}]
        }
    },

		watch: {
			css: {
				files: [
					'views/**/*.scss'
				],
				tasks:['sass']
			},
			livereload: {
				files: [
					'public/stylesheets/*.css',
					'views/**/*.hbs',
					'public/javascript/*.js'
				],
				tasks:[
				],
				options: {
					livereload: true
				}
			}
		}
	});

	// load jshint
	grunt.registerTask('lint', function(target) {
		grunt.task.run([
			'jshint'
		]);
	});

	grunt.registerTask('build', function(target) {
		grunt.task.run([
			'sass',
			'browserify:build'
		]);
	});

	// default option to connect server
	grunt.registerTask('serve', function(target) {
		grunt.task.run([
			'sass',
			'concurrent:dev'
		]);
	});

};
