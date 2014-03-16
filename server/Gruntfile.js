module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		properties: {
			app: 'props.properties'
		},

		compress: {
			buildArchive: {
				options: {
					archive: 'build/nodio-server.zip',
					mode: 'zip'
				},
				files: [
					{ src: 'app/**' },
					{ src: 'express/**' },
					{ src: 'routes/**' },
//					{ src: 'test/**' },
					{ src: 'package.json' },
					{ src: 'server.js' },
					{ src: 'config.js' }
				]
			}
		},

		exec: {
			removeOldArchive: {
				command: 'rm -f build/nodio-server.zip'
			}
		},

		scp: {
			options: {
				host: '<%= app.host %>',
				username: '<%= app.sshUsername %>',
				password: '<%= app.sshPassword %>'
			},
			copyArchive: {
				files: [{
					cwd: 'build',
					src: 'nodio-server.zip',
					dest: '<%= app.directory %>'
				}]
			}
		},

		sshexec: {
			options: {
				host: '<%= app.host >',
				username: '<%= app.sshUsername >',
				password: '<%= app.shhPassword >'
			},
			unzipArchive: {
				command: 'cd <%= app.directory %>; unzip nodio-server.zip'
			},
			stop: {
				command: 'forever stopall'
			},
			start: {
				command: 'cd <%= app.directory %>; forever start server.js'
			},
			removeFiles: {
				command: 'cd <%= app.directory %>; rm -r app express routes package.json server.js config.js; rm /ramdisk/omxplayer' // TODO remove hardcoded path
			}

			// <%= app.directory %>/server.js
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-scp');
	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-properties-reader');


	grunt.registerTask("force",function(set){
		if (set === "on") {
			grunt.option("force",true);
		}
		else if (set === "off") {
			grunt.option("force",false);
		}
		else if (set === "restore") {
			grunt.option("force",previous_force_state);
		}
	});

	var build = ['exec:removeOldArchive', 'compress:buildArchive']
	var undeploy = ['force:on', 'sshexec:stop', 'force:restore', 'sshexec:removeFiles']
	var deploy = ['scp:copyArchive', 'sshexec:unzipArchive', 'sshexec:start']

	// Default task(s).
	grunt.registerTask('default', ['properties'].concat(build).concat(undeploy).concat(deploy));

};