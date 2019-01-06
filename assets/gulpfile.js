'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var importer = require('node-sass-globbing');
var plumber = require('gulp-plumber');
var cssmin = require('gulp-cssmin');
var gulpwatch = require('gulp-watch');


var sass_config = {
  importer: importer,
  includePaths: [
    'node_modules/breakpoint-sass/stylesheets/',
  ]
};

gulp.task('gulp-watch', function() {
  gulp.watch("sass/**/*.scss", ['sass']);
});

gulp.task('sass', function () {
  gulp.src('sass/**/*.scss')
    .pipe(plumber())
    .pipe(sass(sass_config).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version'],
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('css'));
});

gulp.task('default', [ 'gulp-watch']);
