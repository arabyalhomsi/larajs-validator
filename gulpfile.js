var gulp = require('gulp');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var jasmineReporter = require('jasmine-spec-reporter');
var rollup = require('gulp-rollup');


gulp.task('js', function () {

  gulp.src(['./src/**/*.js'])
    .pipe(rollup({
      input: './src/index.js',
      output: {
        format: 'umd',
        name: 'larajsValidator'
      }
    }))
    .pipe(rename('larajsValidator.js'))
    .pipe(gulp.dest('./dist/'));

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
    reporter: new jasmineReporter.SpecReporter()
  }));
});