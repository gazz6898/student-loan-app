const gulp = require('gulp');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');

function js() {
  return gulp
    .src(['src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['@babel/env'], plugins: ['@babel/transform-runtime'] }))
    .pipe(
      minify({
        ext: { src: '.js', min: '.js' },
        noSource: true,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/'));
}

exports.build = js;

exports.default = function () {
  watch(['src/**/*.js'], js);
};
