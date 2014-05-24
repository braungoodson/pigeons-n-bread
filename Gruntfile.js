module.exports = function (grunt) {

	//
	var npmTasks = ['grunt-contrib-watch',];
	for (var t in npmTasks) {
		grunt.loadNpmTasks(npmTasks[t]);
	}

	//
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['index.html','src/**/*.js']
			}
		}
	};
	grunt.initConfig(config);

	//
	var gruntTasks = [['default',['watch']],];
	for (var t in gruntTasks) {
		grunt.registerTask(gruntTasks[t][0],gruntTasks[t][1]);
	}
};