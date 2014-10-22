var
  concat = require('gulp-concat'),
  gulp = require('gulp'),
  jasmine = require('gulp-jasmine-phantom'),
  uglify = require('gulp-uglify');

var srcFiles = [
  'src/inherit.js',
  'src/base.js',
  'src/evented.js',
  'src/statable.js'
];
var specFiles= [
  'spec/inherit.js',
  'spec/evented.js',
  'spec/statable.js'
];

gulp.task('dist', function () {
  var stream = gulp.src(srcFiles)
    .pipe(uglify())
    .pipe(concat('oak-inherit.min.js'))
    .pipe(gulp.dest('dist/'));

  var stream = gulp.src(srcFiles)
    .pipe(concat('oak-inherit.js'))
    .pipe(gulp.dest('dist/'));

  return stream;
});

gulp.task('spec', function () {
  var files = srcFiles.concat(specFiles);
  files.unshift('bower_components/**/**/*.js');
  return gulp.src(files)
    .pipe(jasmine({
      integration: true,
      verbose: true
    }));

});

gulp.task('watch', function () {
  var watcher = gulp.watch('{src,spec}/*.js', ['spec']);
  return watcher;
});

gulp.task('default', ['spec', 'dist', 'docs']);
