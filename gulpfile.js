var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var jasmineReporter = require('jasmine-spec-reporter');

gulp.task('default', function(){


	// JSHint
	gulp.src(['index.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.on('error', function (error) {
		console.error(String(error));
	});
});

gulp.task('test', function () {
	gulp.src(['spec/**/*.js'])

	.pipe(jasmine({reporter: new jasmineReporter()}));
});