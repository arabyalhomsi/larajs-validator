var gulp = require('gulp');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var jasmineReporter = require('jasmine-spec-reporter');
var rollup = require('gulp-rollup');
var connect = require('gulp-connect');

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
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload())

});

gulp.task('jshint', function () {
  gulp.src(['src/index.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
});

gulp.task('dev', function () {
  gulp.src('./dist/**/*.js')
  .pipe(gulp.dest('./dev/js'));
});

gulp.task('connect', function () {
  gulp.start('dev');
  connect.server({
    root: './dev',
    livereload: true,
    port: 1200
  });
});

gulp.task('watch', function () {
  gulp.start('connect');
  gulp.watch('src/**/*.js', ['js', 'dev']);
});

gulp.task('test', function () {
  gulp.src(['spec/**/*.js'])

  .pipe(jasmine({
    reporter: new jasmineReporter.SpecReporter()
  }));
});