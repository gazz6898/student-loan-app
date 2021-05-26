const { src, dest, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

function js() {
  return src('src/**/*.js').pipe(uglify()).pipe(dest('dist/'));
}

exports.build = js;

exports.default = function () {
  watch(['src/**/*.js'], js);
};
