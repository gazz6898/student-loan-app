const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

exports.default = function () {
  return src('src/**/*.js')
    .pipe(babel({ presets: ['@babel/env'], plugins: ['@babel/transform-runtime'] }))
    .pipe(uglify())
    .pipe(dest('dist/'));
};
