var gulp = require('gulp');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var browserify = require('gulp-browserify');
var jasmineReporter = require('jasmine-spec-reporter');
var gUtil = require('gulp-util');
var fs = require('fs');
var packageJson = JSON.parse(fs.readFileSync('./package.json'));

gulp.task('js', function () {

  gulp.src(['src/index.js'])
    .pipe(browserify({
      standalone: packageJson.name,
      debug: true
    }))
    .pipe(rename('larajsValidator.js'))
    .pipe(gulp.dest('dist/'));

});

gulp.task('jshint', function () {
  gulp.src(['src/index.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['js']);
});

gulp.task('test', function () {
  gulp.src(['spec/**/*.js'])

  .pipe(jasmine({
    reporter: new jasmineReporter()
  }));
});