const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

function build() {
  return gulp
    .src('src/**/*.js')
    .pipe(babel({ presets: ['@babel/env'], plugins: ['@babel/transform-runtime'] }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
}

exports.build = build;

function watch() {
  return gulp.watch('src/**/*.js', build);
}

exports.watch = watch;

exports.default = watch;
