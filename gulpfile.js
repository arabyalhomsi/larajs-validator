var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('default', function(){
	gulp.src(['index.js'])

	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.on('error', function (error) {
		console.error(String(error));
	});
});